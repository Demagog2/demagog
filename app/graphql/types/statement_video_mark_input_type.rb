# frozen_string_literal: true

module Types
  class StatementVideoMarkInputType < GraphQL::Schema::InputObject
    argument :start, Int, required: true
    argument :stop, Int, required: true
  end
end
