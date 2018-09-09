# frozen_string_literal: true

Mutations::UpdateUsersRank = GraphQL::Field.define do
  name "UpdateUsersRank"
  type types[!Types::UserType]
  description "Update rank (order of users on about us page)"

  argument :input, !Types::UpdateUsersRankInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["users:edit"])

    User.update_users_rank(args[:input]["ordered_user_ids"])
  }
end
