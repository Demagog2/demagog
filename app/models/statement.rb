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

  belongs_to :speaker
  belongs_to :source, optional: true
  has_many :comments
  has_many :attachments, through: :speaker
  has_one :assessment
  has_one :veracity, through: :assessment
  has_one :statement_transcript_position
  has_one :statement_video_mark
  has_and_belongs_to_many :tags

  default_scope {
    # We keep here only soft-delete, ordering cannot be here because
    # of has_many :through relations which use statements
    kept
  }

  scope :ordered, -> {
    kept
      .left_outer_joins(
        # Doing left outer join so it returns also statements without transcript position
        :statement_transcript_position
      )
      .order(
        "statements.source_id ASC",
        Arel.sql("source_order ASC NULLS LAST"),
        Arel.sql("statement_transcript_positions.start_line ASC NULLS LAST"),
        Arel.sql("statement_transcript_positions.start_offset ASC NULLS LAST"),
        "excerpted_at ASC"
      )
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
    indexes :assessment do
      ElasticMapping.indexes_text_field self, :short_explanation
      ElasticMapping.indexes_text_field self, :explanation_text
      indexes :veracity do
        ElasticMapping.indexes_name_field self, :name
      end
    end
    indexes :source do
      indexes :released_at, type: "date"
      indexes :medium do
        ElasticMapping.indexes_name_field self, :name
      end
    end
    indexes :speaker do
      ElasticMapping.indexes_name_field self, :full_name
    end
  end

  def as_indexed_json(options = {})
    as_json(
      only: [:id, :statement_type, :content, :published],
      include: {
        assessment: {
          only: [:short_explanation, :explanation_text],
          methods: [:explanation_text],
          include: {
            veracity: { only: :name }
          }
        },
        source: {
          only: :released_at,
          include: {
            medium: { only: :name }
          }
        },
        speaker: { only: :full_name, methods: :full_name }
      }
    )
  end

  def self.query_search_published_factual(query)
    search(
      query: {
        bool: {
          must: { simple_query_string: simple_query_string_defaults.merge(query: query) },
          filter: [
            { term: { published: true } },
            { term: { statement_type: TYPE_FACTUAL } }
          ]
        }
      },
      sort: [
        { 'source.released_at': { order: "desc" } }
      ]
    )
  end

  def self.interesting_statements
    order(excerpted_at: :desc)
      .where(statement_type: Statement::TYPE_FACTUAL)
      .where(published: true)
      .joins(:assessment)
      .where(assessments: {
        evaluation_status: Assessment::STATUS_APPROVED
      })
      .limit(4)
      .includes(:speaker)
      .where(important: true)
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
    permissions = user.role.permissions

    # With statements:edit, user can edit anything in statement
    return true if permissions.include? "statements:edit"

    evaluator_allowed_attributes = ["content", "title", "tags"]
    evaluator_allowed_changes =
      assessment.evaluation_status == Assessment::STATUS_BEING_EVALUATED &&
        (changed_attributes.keys - evaluator_allowed_attributes).empty?

    if evaluator_allowed_changes && permissions.include?("statements:edit-as-evaluator") && assessment.user_id == user.id
      return true
    end

    texts_allowed_attributes = ["content", "title"]
    texts_allowed_changes =
      [Assessment::STATUS_BEING_EVALUATED, Assessment::STATUS_APPROVAL_NEEDED, Assessment::STATUS_PROOFREADING_NEEDED].include?(assessment.evaluation_status) &&
        (changed_attributes.keys - texts_allowed_attributes).empty?

    if texts_allowed_changes && permissions.include?("statements:edit-as-proofreader")
      return true
    end

    changed_attributes.empty?
  end

  def display_in_notification
    "#{speaker.first_name} #{speaker.last_name}: „#{content.truncate(50, omission: '…')}“"
  end

  def mentioning_articles
    Article.kept.joins(:segments).where(article_segments: { source_id: source.id }).distinct.order(published_at: :desc)
  end
end
