# frozen_string_literal: true

module Schema::Search::Types
  class SearchResultStatementType < Types::BaseObject
    field :statements, [Types::StatementType], null: false
    field :tags, [TagAggregateType], null: true
    field :veracities, [VeracityAggregateType], null: true
    field :years, [YearAggregateType], null: true
    field :editor_picked, EditorPickedAggregateType, null: true
    field :total_count, GraphQL::Types::Int, null: false
  end
end
