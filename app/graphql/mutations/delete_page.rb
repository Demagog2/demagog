# frozen_string_literal: true

Mutations::DeletePage = GraphQL::Field.define do
  name "DeletePage"
  type !types.ID
  description "Delete existing page"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    id = args[:id].to_i

    begin
      Page.discard(id)

      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
