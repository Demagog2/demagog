# frozen_string_literal: true

class Tag < ApplicationRecord
  has_and_belongs_to_many :statements

  def published_statements_count
    statements.published.count
  end

  def all_statements_count
    statements.count
  end
end
