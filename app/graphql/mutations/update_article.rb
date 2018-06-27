# frozen_string_literal: true

Mutations::UpdateArticle = GraphQL::Field.define do
  name "UpdateArticle"
  type Types::ArticleType
  description "Update existing article"

  argument :id, !types.ID
  argument :article_input, !Types::ArticleInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Article.update_article(args[:id], args[:article_input].to_h)
  }
end
