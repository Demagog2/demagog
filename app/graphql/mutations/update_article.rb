# frozen_string_literal: true

module Mutations
  class UpdateArticle < GraphQL::Schema::Mutation
    description "Update existing article"

    field :article, Types::ArticleType, null: false

    argument :id, ID, required: true
    argument :article_input, Types::ArticleInputType, required: true

    def resolve(id:, article_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      { article: Article.update_article(id, article_input.to_h) }
    end
  end
end
