# frozen_string_literal: true

module Mutations
  class UpdateArticleTag < GraphQL::Schema::Mutation
    description "Update existing article tag"

    argument :id, Int, required: true
    field :articleTag, Types::ArticleTagType, null: false

    argument :article_tag_input, Types::ArticleTagInputType, required: true

    def resolve(article_tag_input:, id:)
      Utils::Auth.authenticate(context)
      { articleTag: ArticleTag.update(id, article_tag_input.to_h) }
    end
  end
end
