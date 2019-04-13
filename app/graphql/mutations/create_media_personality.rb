# frozen_string_literal: true

module Mutations
  class CreateMediaPersonality < GraphQL::Schema::Mutation
    description "Add new media personality"

    field :media_personality, Types::MediaPersonalityType, null: false

    argument :media_personality_input, Types::MediaPersonalityInputType, required: true

    def resolve(media_personality_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      { media_personality: MediaPersonality.create(media_personality_input.to_h) }
    end
  end
end
