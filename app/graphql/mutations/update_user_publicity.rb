# frozen_string_literal: true

module Mutations
  class UpdateUserPublicity < GraphQL::Schema::Mutation
    description "Update user publicity"

    field :user, Types::UserType, null: false

    argument :id, Int, required: true
    argument :user_public, Boolean, required: true

    def resolve(id:, user_public:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit-user-public"])

      { user: User.update(id, user_public: user_public) }
    end
  end
end
