# frozen_string_literal: true

class Statement < ApplicationRecord
  TYPE_FACTUAL = "factual"
  TYPE_PROMISE = "promise"
  TYPE_NEWYEARS = "newyears"

  include ActiveModel::Dirty
  include Searchable
  include Discardable

  after_create { ElasticsearchWorker.perform_async(:statement, :index, self.id) }
  after_update { ElasticsearchWorker.perform_async(:statement, :update, self.id) }
  after_discard { ElasticsearchWorker.perform_async(:statement, :destroy, self.id) }

  after_create :generate_preview_image, if: Proc.new { |statement| statement.statement_type == Statement::TYPE_FACTUAL && statement.published && statement.published_previously_changed? }
  after_update :generate_preview_image, if: Proc.new { |statement| statement.statement_type == Statement::TYPE_FACTUAL && statement.published && statement.published_previously_changed? }

  belongs_to :source, optional: true
  belongs_to :source_speaker
  has_one :speaker, through: :source_speaker
  has_many :comments
  has_one :assessment
  has_one :veracity, through: :assessment
  has_one :statement_transcript_position
  has_one :statement_video_mark
  has_and_belongs_to_many :tags
  has_one_attached :preview_image

  has_many :article_tag_statements, class_name: "ArticleTagStatement"
  has_and_belongs_to_many :article_tags, join_table: "article_tag_statements", autosave: false

  default_scope {
    # We keep here only soft-delete, ordering cannot be here because
    # of has_many :through relations which use statements
    kept
  }

  scope :ordered, -> {
    Statement.sort_statements_query(kept)
  }

  scope :published, -> {
    ordered
      .where(published: true)
      .joins(:assessment)
      .where(assessments: {
        evaluation_status: Assessment::STATUS_APPROVED
      })
  }

  scope :factual_and_published, -> {
    published
      .where(statement_type: Statement::TYPE_FACTUAL)
  }

  scope :promise_and_published, -> {
    published
      .where(statement_type: Statement::TYPE_PROMISE)
  }

  scope :published_important_first, -> {
    # We first call order and then the published scope so the important DESC
    # order rule is used first and then the ones from scope ordered
    # (source_order, etc.)
    order(important: :desc).published
  }

  mapping do
    indexes :id, type: "long"
    indexes :statement_type, type: "keyword"
    ElasticMapping.indexes_text_field self, :content
    indexes :published, type: "boolean"
    indexes :important, type: "boolean"
    indexes :assessment do
      ElasticMapping.indexes_text_field self, :short_explanation
      ElasticMapping.indexes_text_field self, :explanation_text
      indexes :veracity do
        indexes :key, type: "keyword"
        ElasticMapping.indexes_name_field self, :name
      end
    end
    indexes :source do
      indexes :released_at, type: "date"
      indexes :released_year, type: "long"
      indexes :medium do
        ElasticMapping.indexes_name_field self, :name
      end
    end
    indexes :source_speaker do
      ElasticMapping.indexes_name_field self, :full_name
      ElasticMapping.indexes_text_field self, :role
      indexes :speaker do
        indexes :id, type: "long"
      end
      indexes :body do
        indexes :id, type: "long"
      end
    end
    indexes :tags do
      indexes :id, type: "long"
      ElasticMapping.indexes_text_field self, :name
    end
  end

  def as_indexed_json(options = {})
    as_json(
      only: [:id, :statement_type, :content, :published, :important],
      include: {
        assessment: {
          only: [:short_explanation, :explanation_text],
          methods: [:explanation_text],
          include: {
            veracity: { only: [:key, :name] }
          }
        },
        source: {
          only: [:released_at, :released_year],
          methods: [:released_year],
          include: {
            medium: { only: :name }
          }
        },
        source_speaker: {
          only: [:full_name, :role, :slug],
          methods: :full_name,
          include: {
            speaker: {
              only: :id,
            },
            body: {
              only: :id
            }
          }
        },
        tags: { only: [:id, :name] }
      }
    )
  end

  def self.sort_statements_query(query, sources_chronologically = true)
    query
      .joins(:source)
      .left_outer_joins(
        # Doing left outer join so it returns also statements without transcript position
        :statement_transcript_position
      )
      .order(
        "sources.released_at #{sources_chronologically ? 'ASC' : 'DESC'}",

        # Inside source we keep always the same order
        Arel.sql("source_order ASC NULLS LAST"),
        Arel.sql("statement_transcript_positions.start_line ASC NULLS LAST"),
        Arel.sql("statement_transcript_positions.start_offset ASC NULLS LAST"),
        "excerpted_at ASC"
      )
  end

  # @return [Assessment]
  def approved_assessment
    Assessment.find_by(
      statement: self,
      evaluation_status: Assessment::STATUS_APPROVED
    )
  end

  # Meant to be used after setting new attributes with assign_attributes, just
  # before calling save! on the record
  def is_user_authorized_to_save(user)
    # With statements:edit, user can edit anything in statement
    return true if user.authorized?("statements:edit")

    evaluator_allowed_attributes = ["content", "title", "tags"]
    evaluator_allowed_changes =
      assessment.evaluation_status == Assessment::STATUS_BEING_EVALUATED &&
        (changed_attributes.keys - evaluator_allowed_attributes).empty?

    if evaluator_allowed_changes && user.authorized?("statements:edit-as-evaluator") && assessment.evaluated_by?(user)
      return true
    end

    texts_allowed_attributes = ["content", "title"]
    texts_allowed_changes =
      [Assessment::STATUS_BEING_EVALUATED, Assessment::STATUS_APPROVAL_NEEDED, Assessment::STATUS_PROOFREADING_NEEDED].include?(assessment.evaluation_status) &&
        (changed_attributes.keys - texts_allowed_attributes).empty?

    if texts_allowed_changes && user.authorized?("statements:edit-as-proofreader")
      return true
    end

    changed_attributes.empty?
  end

  def display_in_notification
    "#{speaker.first_name} #{speaker.last_name}: „#{content.truncate(50, omission: '…')}“"
  end

  def mentioning_articles
    Article.published.joins(:segments)
      .where(article_segments: { source_id: source.id })
      .or(Article.where(article_segments: { statement_id: id }))
      .distinct.order(published_at: :desc)
  end

  private
    def generate_preview_image
      GenerateStatementPreviewImageWorker.perform_async(self.id,)
    end
end
