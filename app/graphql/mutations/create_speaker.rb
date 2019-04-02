# frozen_string_literal: true

module Mutations
  class CreateSpeaker < GraphQL::Schema::Mutation
    description "Add new speaker"

    field :speaker, Types::SpeakerType, null: false

    argument :speaker_input, Types::SpeakerInputType, required: true

    def resolve(speaker_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["speakers:edit"])

      speaker = speaker_input.to_h

      speaker[:memberships] = speaker[:memberships].map do |mem|
        Membership.new(body: Body.find(mem[:body_id]), since: mem[:since], until: mem[:until])
      end

      { speaker: Speaker.create!(speaker) }
    end
  end
end

