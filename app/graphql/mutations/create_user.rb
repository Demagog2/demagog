# frozen_string_literal: true

module Mutations
  class CreateUser < GraphQL::Schema::Mutation
    description "Add new user"

    field :user, Types::UserType, null: false

    argument :user_input, Types::UserInputType, required: true

    def resolve(user_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit"])

      { user: User.create_user(user_input.to_h) }
    end
  end
end
