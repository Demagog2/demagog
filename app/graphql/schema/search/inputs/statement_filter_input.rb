# frozen_string_literal: true

module Schema::Search::Inputs
  class StatementFilterInput < GraphQL::Schema::InputObject
    argument :tags, [GraphQL::Types::Int], required: false
    argument :veracities, [Types::VeracityKeyType], required: false
    argument :years, [GraphQL::Types::Int], required: false
    argument :editor_picked, GraphQL::Types::Boolean, required: false
  end
end
