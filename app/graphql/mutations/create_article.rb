# frozen_string_literal: true

module Mutations
  class CreateArticle < GraphQL::Schema::Mutation
    description "Add new article"

    field :article, Types::ArticleType, null: false

    argument :article_input, Types::ArticleInputType, required: true

    def resolve(article_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      { article: Article.create_article(article_input.to_h) }
    end
  end
end
