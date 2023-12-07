# frozen_string_literal: true

module Schema::Search::Inputs
  class StatementFilterInput < GraphQL::Schema::InputObject
    argument :tags, [GraphQL::Types::Int], required: false
    argument :veracities, [GraphQL::Types::ID], required: false
  end
end
