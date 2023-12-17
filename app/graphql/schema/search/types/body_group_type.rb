# frozen_string_literal: true

module Schema::Search::Types
  class BodyGroupType < Types::BaseObject
    field :name, GraphQL::Types::String, null: false
    field :bodies, [BodyAggregateType], null: false
  end
end
