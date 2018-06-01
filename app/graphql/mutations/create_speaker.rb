# frozen_string_literal: true

Mutations::CreateSpeaker = GraphQL::Field.define do
  name "CreateSpeaker"
  type Types::SpeakerType
  description "Add new speaker"

  argument :speaker_input, !Types::SpeakerInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    speaker = args[:speaker_input].to_h

    speaker["memberships"] = speaker["memberships"].map do |mem|
      Membership.new(body: Body.find(mem["body_id"]), since: mem["since"], until: mem["until"])
    end

    Speaker.create!(speaker)
  }
end
