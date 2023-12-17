# frozen_string_literal: true

module Schema::Search::Types
  class BodyAggregateType < Types::BaseObject
    field :body, Types::BodyType, null: false
    field :count, GraphQL::Types::Int, null: false
    field :is_selected, GraphQL::Types::Boolean, null: false
  end
end
