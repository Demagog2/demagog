# frozen_string_literal: true

Mutations::UpdateMediaPersonality = GraphQL::Field.define do
  name "UpdateMediaPersonality"
  type Types::MediaPersonalityType
  description "Update existing media personality"

  argument :id, !types.ID
  argument :media_personality_input, !Types::MediaPersonalityInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    MediaPersonality.update(args[:id], args[:media_personality_input].to_h)
  }
end
