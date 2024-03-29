# frozen_string_literal: true

module Mutations
  class DeleteSpeaker < GraphQL::Schema::Mutation
    description "Delete existing speaker"

    field :id, ID, null: false

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["speakers:edit"])

      id = id.to_i

      begin
        Speaker.destroy(id)
        { id: }
      rescue ActiveRecord::RecordNotFound => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
