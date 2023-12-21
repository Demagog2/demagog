# frozen_string_literal: true

module Schema::Search::Types
  class YearAggregateType < BaseAggregateType
    field :year, GraphQL::Types::Int, null: false
  end
end
