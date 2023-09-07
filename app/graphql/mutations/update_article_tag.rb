# frozen_string_literal: true

module Mutations
  class UpdateArticleTag < BaseMutation
    description "Update existing article tag"

    argument :id, Int, required: true
    argument :article_tag_input, Types::ArticleTagInputType, required: true

    field :article_tag, Types::ArticleTagType, null: false

    def resolve(article_tag_input:, id:)
      authorize!(:edit, ArticleTag)

      { article_tag: ArticleTag.update(id, article_tag_input.to_h) }
    rescue CanCan::AccessDenied
      raise Errors::AuthenticationNeededError.new
    end
  end
end
