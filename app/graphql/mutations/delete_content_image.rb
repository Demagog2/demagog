# frozen_string_literal: true

module Mutations
  class DeleteContentImage < GraphQL::Schema::Mutation
    description "Delete existing content image"

    field :id, ID, null: true

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["images:delete"])

      id = id.to_i

      begin
        ContentImage.discard(id)

        { id: id }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
