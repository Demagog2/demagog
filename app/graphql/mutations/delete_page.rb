# frozen_string_literal: true

module Mutations
  class DeletePage < GraphQL::Schema::Mutation
    description "Delete existing page"

    field :id, ID, null: true

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["pages:edit"])

      id = id.to_i

      begin
        Page.discard(id)

        { id: id }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
