# frozen_string_literal: true

module Types
  class StatementsVideoMarksInputType < GraphQL::Schema::InputObject
    argument :statement_id, ID, required: true
    argument :start, Int, required: true
    argument :stop, Int, required: true
  end
end
