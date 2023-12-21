# frozen_string_literal: true

module Schema::Search::Types
  class BaseAggregateType < Types::BaseObject
    field :count, GraphQL::Types::Int, null: false
    field :is_selected, GraphQL::Types::Boolean, null: false
  end
end
