# frozen_string_literal: true

class Segment < ApplicationRecord
  TYPE_TEXT = "text"
  TYPE_STATEMENTS_SET = "statements_set"

  has_many :segment_has_statements
  has_many :article_has_segments

  has_many :statements, through: :segment_has_statements
  has_many :articles, through: :article_has_segments

  def is_text?
    segment_type == Segment::TYPE_TEXT
  end

  def all_published_statements
    statements.published_important_first
  end

  def filtered_published_statements(statements_filters)
    filtered = statements.published_important_first

    if statements_filters[:speaker_id]
      filtered = filtered.where(speaker_id: statements_filters[:speaker_id])
    end

    if statements_filters[:veracity_key]
      filtered = filtered
        .joins(assessment: :veracity)
        .where(assessments: {
          veracities: {
            key: statements_filters[:veracity_key]
          }
        })
    end

    filtered
  end
end
