# frozen_string_literal: true

module Schema::Search::Inputs
  class StatementFilterInput < GraphQL::Schema::InputObject
    argument :tags, [GraphQL::Types::Int], required: false
  end
end
