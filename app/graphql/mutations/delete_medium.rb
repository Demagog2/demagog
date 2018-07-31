# frozen_string_literal: true

Mutations::DeleteMedium = GraphQL::Field.define do
  name "DeleteMedium"
  type !types.ID
  description "Delete existing medium"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    id = args[:id].to_i

    begin
      Medium.update(id, deleted_at: Time.now)

      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
