# frozen_string_literal: true

module Schema::Search::Types
  class VeracityAggregateType < Types::BaseObject
    field :veracity, Types::VeracityType, null: false
    field :count, GraphQL::Types::Int, null: false
  end
end
