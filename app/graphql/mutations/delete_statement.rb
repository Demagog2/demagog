# frozen_string_literal: true

module Mutations
  class DeleteStatement < GraphQL::Schema::Mutation
    description "Delete existing statement"

    field :id, ID, null: false

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["statements:edit"])

      begin
        Statement.discard(id.to_i)
        { id: }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
