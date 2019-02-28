# frozen_string_literal: true

Mutations::DeleteStatement = GraphQL::Field.define do
  name "DeleteStatement"
  type !types.ID
  description "Delete existing statement"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["statements:edit"])

    id = args[:id].to_i

    begin
      Statement.discard(id)
      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
