# frozen_string_literal: true

Mutations::DeleteUser = GraphQL::Field.define do
  name "DeleteUser"
  type !types.Int
  description "Delete existing user"

  argument :id, !types.Int

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    # Olol
    begin
      User.destroy(args[:id].to_i)
      202
    rescue
      202
    end
  }
end
