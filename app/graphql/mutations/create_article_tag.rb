# frozen_string_literal: true

module Mutations
  class CreateArticleTag < GraphQL::Schema::Mutation
    description "Add new tag"

    field :articleTag, Types::ArticleTagType, null: false

    argument :article_tag_input, Types::ArticleTagInputType, required: true

    def resolve(article_tag_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      articleTag = ArticleTag.create(article_tag_input.to_h)

      { articleTag: }
    end
  end
end
