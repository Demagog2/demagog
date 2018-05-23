# frozen_string_literal: true

Mutations::UpdateUser = GraphQL::Field.define do
  name "UpdateUser"
  type Types::UserType
  description "Update existing user"

  argument :id, !types.Int
  argument :user_input, !Types::UserInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    User.update(args[:id], args[:user_input].to_h)
  }
end
