# frozen_string_literal: true

module Mutations
  class DeleteBody < GraphQL::Schema::Mutation
    description "Delete existing body"

    field :id, ID, null: false

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["bodies:edit"])

      id = id.to_i

      begin
        Body.destroy(id)

        { id: id }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
