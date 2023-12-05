# frozen_string_literal: true

module Schema::Search::Resolvers
  class StatementSearchResultResolver < GraphQL::Schema::Resolver
    type Schema::Search::Types::SearchResultStatementType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0
    argument :include_aggregations, GraphQL::Types::Boolean, required: false, default_value: false

    def resolve(term:, limit:, offset:, include_aggregations:)
      if include_aggregations
        search_with_aggregations(term:, limit:, offset:)
      else
        search(term:, limit:, offset:)
      end
    end

    def search(term:, limit:, offset:)
      statement_search = StatementsElasticQueryService.search_published_factual({ query: term }, from: offset, size: limit)

      { statements: statement_search.records.to_a, total_count: statement_search.total_count }
    end

    def search_with_aggregations(term:, limit:, offset:)
      statement_search, aggregations = StatementsElasticQueryService.search_with_aggregations({ query: term }, from: offset, size: limit)

      tag_aggregation = aggregations.fetch("tag_id", {})

      tags = Tag.where(id: tag_aggregation.keys.select { |tag_id| tag_id != -1 }).map do |tag|
        { tag:, count: tag_aggregation[tag.id] }
      end

      { statements: statement_search.records.to_a, total_count: statement_search.total_count, tags: }
    end
  end
end
