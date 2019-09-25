# frozen_string_literal: true

module Mutations
  class UpdateUserActiveness < GraphQL::Schema::Mutation
    description "Toggle user active. Inactive user cannot access the system."

    field :user, Types::UserType, null: false

    argument :id, Int, required: true
    argument :user_active, Boolean, required: true

    def resolve(id:, user_active:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit"])

      { user: User.update(id, active: user_active) }
    end
  end
end
