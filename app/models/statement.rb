# frozen_string_literal: true

class Statement < ApplicationRecord
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
    where(deleted_at: nil)
      .includes(:statement_transcript_position)
      .order(
        "statement_transcript_positions.start_line ASC",
        "statement_transcript_positions.start_offset ASC",
        "excerpted_at ASC"
      )
  }

  scope :published, -> {
    where(published: true, deleted_at: nil)
      .order(excerpted_at: :desc)
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
end
