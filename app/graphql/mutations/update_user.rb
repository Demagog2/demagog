# frozen_string_literal: true

module Mutations
  class UpdateUser < GraphQL::Schema::Mutation
    description "Update existing user"

    field :user, Types::UserType, null: false

    argument :id, Int, required: true
    argument :user_input, Types::UserInputType, required: true

    def resolve(user_input:, id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit"])

      { user: User.update(id, user_input.to_h) }
    end
  end
end
