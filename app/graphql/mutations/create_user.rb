# frozen_string_literal: true

Mutations::CreateUser = GraphQL::Field.define do
  name "CreateUser"
  type Types::UserType
  description "Add new user"

  argument :user_input, !Types::UserInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    User.create!(args[:user_input].to_h)
  }
end
