# frozen_string_literal: true

module Mutations
  class DeleteMediaPersonality < GraphQL::Schema::Mutation
    description "Delete existing media personality"

    field :id, ID, null: false

    argument :id, ID, required: true

    def resolve(id:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      begin
        MediaPersonality.delete_media_personality(id.to_i)

        { id: id }
      rescue ActiveRecord::RecordNotFound, ActiveModel::ValidationError => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
