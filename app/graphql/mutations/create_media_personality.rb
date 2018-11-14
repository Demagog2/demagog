# frozen_string_literal: true

Mutations::CreateMediaPersonality = GraphQL::Field.define do
  name "CreateMediaPersonality"
  type Types::MediaPersonalityType
  description "Add new media personality"

  argument :media_personality_input, !Types::MediaPersonalityInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    MediaPersonality.create(args[:media_personality_input].to_h)
  }
end
