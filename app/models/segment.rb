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

  def published_statements
    statements.published_important_first
  end
end
