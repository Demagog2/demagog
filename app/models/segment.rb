# frozen_string_literal: true

class Segment < ApplicationRecord
  TYPE_TEXT = "text"
  TYPE_SOURCE_STATEMENTS = "source_statements"

  has_many :article_has_segments
  has_many :articles, through: :article_has_segments
  belongs_to :source, optional: true

  scope :source_statements_type_only, -> {
    where(segment_type: Segment::TYPE_SOURCE_STATEMENTS)
  }

  def is_text?
    segment_type == Segment::TYPE_TEXT
  end

  def is_source_statements?
    segment_type == Segment::TYPE_SOURCE_STATEMENTS
  end

  def all_published_statements
    raise "Segment statements are available only for source_statements type" unless is_source_statements?

    source.statements.published_important_first
  end

  def filtered_published_statements(statements_filters)
    raise "Segment statements are available only for source_statements type" unless is_source_statements?

    filtered = source.statements.published_important_first

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
