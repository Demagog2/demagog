# frozen_string_literal: true

Mutations::CreateUser = GraphQL::Field.define do
  name "CreateUser"
  type Types::UserType
  description "Add new user"

  argument :user_input, !Types::UserInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["users"])

    User.create!(args[:user_input].to_h)
  }
end
