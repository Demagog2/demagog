# frozen_string_literal: true

module Schema::Search::Types
  class SearchResultStatementType < Types::BaseObject
    field :statements, [Types::StatementType], null: false
    field :total_count, GraphQL::Types::Int, null: false
  end
end
