# frozen_string_literal: true

Mutations::DeleteUser = GraphQL::Field.define do
  name "DeleteUser"
  type !types.ID
  description "Delete existing user"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    id = args[:id].to_i

    begin
      User.destroy(id)
      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
