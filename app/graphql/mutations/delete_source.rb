# frozen_string_literal: true

Mutations::DeleteSource = GraphQL::Field.define do
  name "DeleteSource"
  type !types.ID
  description "Delete existing source with all its statements"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["sources:edit"])

    id = args[:id].to_i

    begin
      Source.transaction do
        source = Source.discard(id)
        source.statements.discard_all
      end

      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
