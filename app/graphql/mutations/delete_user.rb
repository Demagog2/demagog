# frozen_string_literal: true

module Mutations
  class DeleteUser < GraphQL::Schema::Mutation
    description "Delete existing user"

    field :id, ID, null: true

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit"])

      id = id.to_i

      begin
        User.discard(id)

        { id: id }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
