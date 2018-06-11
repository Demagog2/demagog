# frozen_string_literal: true

Mutations::CreateArticle = GraphQL::Field.define do
  name "CreateArticle"
  type Types::ArticleType
  description "Add new article"

  argument :article_input, !Types::ArticleInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Article.create_article(args[:article_input].to_h)
  }
end
