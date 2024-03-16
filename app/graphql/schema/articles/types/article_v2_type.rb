# frozen_string_literal: true

module Schema::Articles::Types
  class ArticleV2Type < GraphQL::Schema::Union
    possible_types SingleStatementArticleType, Types::ArticleType

    def self.resolve_type(article, _ctx)
      if article.article_type_single_statement?
        SingleStatementArticleType
      else
        Types::ArticleType
      end
    end
  end
end
