# frozen_string_literal: true

class StatementTag < ApplicationRecord
  self.table_name = "statements_tags"

  belongs_to :statement
  belongs_to :tag
end
