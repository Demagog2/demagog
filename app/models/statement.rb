# frozen_string_literal: true

class Statement < ApplicationRecord
  include ActiveModel::Dirty

  belongs_to :speaker
  belongs_to :source, optional: true
  has_many :comments
  has_many :attachments, through: :speaker
  has_many :segment_has_statements
  has_many :segments, through: :segment_has_statements
  has_many :article_has_segments, through: :segments
  has_many :articles, through: :article_has_segments
  has_one :assessment
  has_one :veracity, through: :assessment
  has_one :statement_transcript_position

  default_scope {
    # We keep here only soft-delete, ordering cannot be here because
    # of has_many :through relations which use statements
    where(deleted_at: nil)
  }

  scope :ordered, -> {
    where(deleted_at: nil)
      .left_outer_joins(
        # Doing left outer join so it returns also statements without transcript position
        :statement_transcript_position
      )
      .order(
        # -column DESC means we sort in ascending order, but we want NULL values at the end
        # See https://stackoverflow.com/questions/2051602/mysql-orderby-a-number-nulls-last
        # It means that when user provides manual sorting in source_order columns, it will be
        # used first and rest of the statements will be after
        Arel.sql("- source_order DESC"),
        Arel.sql("- statement_transcript_positions.start_line DESC"),
        Arel.sql("- statement_transcript_positions.start_offset DESC"),
        "excerpted_at ASC"
      )
  }

  scope :published, -> {
    ordered
      .where(published: true)
      .joins(:assessment)
      .where.not(assessments: {
        veracity_id: nil
      })
      .where(assessments: {
        evaluation_status: Assessment::STATUS_APPROVED
      })
  }

  scope :relevant_for_statistics, -> {
    published
      .where(count_in_statistics: true)
  }

  scope :published_important_first, -> {
    # We first call order and then the published scope so the important DESC
    # order rule is used first and then the ones from scope ordered
    # (source_order, etc.)
    order(important: :desc).published
  }

  def self.interesting_statements
    limit(4)
      .published
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

  def is_user_authorized_to_save(user)
    permissions = user.role.permissions

    # With statements:edit, user can edit anything in statement
    return true if permissions.include? "statements:edit"

    evaluator_allowed_attributes = ["content"]
    evaluator_allowed_changes =
      assessment.evaluation_status == Assessment::STATUS_BEING_EVALUATED &&
      (changed_attributes.keys - evaluator_allowed_attributes).empty?

    if evaluator_allowed_changes && permissions.include?("statements:edit-as-evaluator") && assessment.user_id == user.id
      return true
    end

    texts_allowed_attributes = ["content"]
    texts_allowed_changes =
      [Assessment::STATUS_BEING_EVALUATED, Assessment::STATUS_APPROVAL_NEEDED].include?(assessment.evaluation_status) &&
      (changed_attributes.keys - texts_allowed_attributes).empty?

    if texts_allowed_changes && permissions.include?("statements:edit-texts")
      return true
    end

    changed_attributes.empty?
  end
end
