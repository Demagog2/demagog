# frozen_string_literal: true

Mutations::UpdateUserPublicity = GraphQL::Field.define do
  name "UpdateUserPublicity"
  type Types::UserType
  description "Update user publicity"

  argument :id, !types.Int
  argument :user_public, !types.Boolean

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["users:edit-user-public"])

    User.update(args[:id], user_public: args[:user_public])
  }
end
