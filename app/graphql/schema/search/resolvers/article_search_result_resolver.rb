# frozen_string_literal: true

module Schema::Search::Resolvers
  class ArticleSearchResultResolver < GraphQL::Schema::Resolver
    type Schema::Search::Types::SearchResultArticleType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0

    def resolve(term:, limit:, offset:)
      article_search = Article.query_search_published(term, from: offset, size: limit)

      { articles: article_search.records.to_a, total_count: article_search.total_count }
    end
  end
end
