# frozen_string_literal: true

module Schema::Search::Types
  class SearchResultArticleType < Types::BaseObject
    field :articles, [Types::ArticleType], null: false
    field :total_count, GraphQL::Types::Int, null: false
  end
end
