# frozen_string_literal: true

module Mutations
  class UpdateSpeaker < GraphQL::Schema::Mutation
    description "Update existing speaker"

    field :speaker, Types::SpeakerType, null: false

    argument :id, ID, required: true
    argument :speaker_input, Types::SpeakerInputType, required: true

    def resolve(id:, speaker_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["speakers:edit"])

      speaker = speaker_input.to_h

      speaker[:memberships] = speaker[:memberships].map do |mem|
        membership = mem[:id] ? Membership.find(mem[:id]) : Membership.new

        membership.assign_attributes(
          body: Body.find(mem[:body_id]),
          since: mem[:since],
          until: mem[:until]
        )

        membership
      end

      Speaker.transaction do
        speaker[:memberships].each(&:save)

        { speaker: Speaker.update(id, speaker) }
      end
    end
  end
end
