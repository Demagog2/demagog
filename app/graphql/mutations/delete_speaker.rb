# frozen_string_literal: true

Mutations::DeleteSpeaker = GraphQL::Field.define do
  name "DeleteSpeaker"
  type !types.ID
  description "Delete existing speaker"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["speakers"])

    id = args[:id].to_i

    begin
      Speaker.destroy(id)
      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
