# frozen_string_literal: true

module Mutations
  class DeleteSource < GraphQL::Schema::Mutation
    description "Delete existing source and all it's statements"

    field :id, ID, null: false

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["sources:edit"])

      begin
        Source.transaction do
          source = Source.find(id)

          source.discard
          source.statements.discard_all
        end

        { id: id }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
