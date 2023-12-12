# frozen_string_literal: true

module Schema::Search::Types
  class EditorPickedAggregateType < Types::BaseObject
    field :count, GraphQL::Types::Int, null: false
  end
end
