# frozen_string_literal: true

module Mutations
  class UpdateUsersRank < GraphQL::Schema::Mutation
    description "Update rank (order of users on about us page)"

    field :users, [Types::UserType], null: false

    argument :ordered_user_ids, [ID], required: true

    def resolve(ordered_user_ids:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit"])

      { users: User.update_users_rank(ordered_user_ids) }
    end
  end
end

