# frozen_string_literal: true

Mutations::DeleteBody = GraphQL::Field.define do
  name "DeleteBody"
  type !types.ID
  description "Delete existing body"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["bodies"])

    id = args[:id].to_i

    begin
      Body.destroy(id)
      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
