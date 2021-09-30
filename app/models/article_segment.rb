# frozen_string_literal: true

class ArticleSegment < ApplicationRecord
  TYPE_TEXT = "text"
  TYPE_SOURCE_STATEMENTS = "source_statements"
  TYPE_PROMISE = "promise"
  TYPE_SINGLE_STATEMENT = "single_statement"

  belongs_to :source, optional: true
  belongs_to :article, optional: true
  belongs_to :statement, optional: true

  scope :ordered, -> {
    order(order: :asc)
  }

  scope :source_statements_type_only, -> {
    where(segment_type: ArticleSegment::TYPE_SOURCE_STATEMENTS)
  }

  scope :text_type_only, -> {
    where(segment_type: ArticleSegment::TYPE_TEXT)
  }

  scope :single_statement_only, -> {
    where(segment_type: ArticleSegment::TYPE_SINGLE_STATEMENT)
  }

  def is_text?
    segment_type == ArticleSegment::TYPE_TEXT
  end

  def is_source_statements?
    segment_type == ArticleSegment::TYPE_SOURCE_STATEMENTS
  end

  def is_promise?
    segment_type == ArticleSegment::TYPE_PROMISE
  end

  def is_single_statement?
    segment_type == ArticleSegment::TYPE_SINGLE_STATEMENT
  end

  def all_published_statements
    if is_source_statements?
      return source.statements.published_important_first
    end

    if is_single_statement? && statement
      return Statement.published_important_first.where(id: statement.id)
    end

    []
  end
end
