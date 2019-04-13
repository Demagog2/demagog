# frozen_string_literal: true

module Mutations
  class DeleteMedium < GraphQL::Schema::Mutation
    description "Delete existing medium"

    field :id, ID, null: false

    argument :id, ID, required: true

    def resolve(id:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      begin
        Medium.delete_medium(id.to_i)

        { id: id }
      rescue ActiveRecord::RecordNotFound, ActiveModel::ValidationError => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
