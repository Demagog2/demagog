# frozen_string_literal: true

module Schema::Search::Resolvers
  class StatementSearchResultResolver < GraphQL::Schema::Resolver
    type Schema::Search::Types::SearchResultStatementType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0

    def resolve(term:, limit:, offset:)
      statement_search = StatementsElasticQueryService.search_published_factual({ query: term }, from: offset, size: limit)

      { statements: statement_search.records.to_a, total_count: statement_search.total_count }
    end
  end
end
