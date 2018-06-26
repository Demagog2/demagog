# frozen_string_literal: true

Mutations::UpdateUser = GraphQL::Field.define do
  name "UpdateUser"
  type Types::UserType
  description "Update existing user"

  argument :id, !types.Int
  argument :user_input, !Types::UserInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["users"])

    User.update(args[:id], args[:user_input].to_h)
  }
end
