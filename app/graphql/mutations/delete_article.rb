# frozen_string_literal: true

Mutations::DeleteArticle = GraphQL::Field.define do
  name "DeleteArticle"
  type !types.ID
  description "Delete existing article"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    id = args[:id].to_i

    begin
      Article.discard(id)

      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
