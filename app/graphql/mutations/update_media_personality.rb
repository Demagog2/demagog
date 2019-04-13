# frozen_string_literal: true

module Mutations
  class UpdateMediaPersonality < GraphQL::Schema::Mutation
    description "Update existing media personality"

    field :media_personality, Types::MediaPersonalityType, null: false

    argument :id, ID, required: true
    argument :media_personality_input, Types::MediaPersonalityInputType, required: true

    def resolve(id:, media_personality_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      { media_personality: MediaPersonality.update(id, media_personality_input.to_h) }
    end
  end
end
