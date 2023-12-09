# frozen_string_literal: true

module Schema::Search::Types
  class YearAggregateType < Types::BaseObject
    field :year, GraphQL::Types::Int, null: false
    field :count, GraphQL::Types::Int, null: false
  end
end
