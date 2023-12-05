# frozen_string_literal: true

module Schema::Search::Types
  class TagAggregateType < Types::BaseObject
    field :tag, Types::TagType, null: false
    field :count, GraphQL::Types::Int, null: false
  end
end
