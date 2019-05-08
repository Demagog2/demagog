# frozen_string_literal: true

class Statement < ApplicationRecord
  TYPE_FACTUAL = "factual"
  TYPE_PROMISE = "promise"

  include ActiveModel::Dirty
  include Discardable

  belongs_to :speaker
  belongs_to :source, optional: true
  has_many :comments
  has_many :attachments, through: :speaker
  has_one :assessment
  has_one :veracity, through: :assessment
  has_one :statement_transcript_position
  has_and_belongs_to_many :tags

  after_update :invalidate_caches

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

  scope :factual_and_relevant_for_statistics, -> {
    published
      .where(count_in_statistics: true)
      .where(statement_type: Statement::TYPE_FACTUAL)
  }

  scope :published_important_first, -> {
    # We first call order and then the published scope so the important DESC
    # order rule is used first and then the ones from scope ordered
    # (source_order, etc.)
    order(important: :desc).published
  }

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
    "#{speaker.first_name} #{speaker.last_name}: „#{content.truncate(50, omission: '…')}‟"
  end

  def mentioning_articles
    Article.joins(:segments).where(article_segments: { source_id: source.id }).distinct.order(published_at: :desc)
  end

  private
    def invalidate_caches
      mentioning_articles.each do |article|
        Stats::Article::StatsBuilderFactory.new.create(Settings).invalidate(article)
      end
    end
end
