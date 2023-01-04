# frozen_string_literal: true

module Mutations
  class CreateSource < GraphQL::Schema::Mutation
    description "Add new source"

    field :source, Types::SourceType, null: false

    argument :source_input, Types::SourceInputType, required: true

    def resolve(source_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, %w[sources:edit])

      source_data = source_input.to_h

      source_data[:experts] = source_data.fetch(:experts, []).map { |user_id| User.find(user_id) }

      source_data[:media_personalities] =
      source_data.fetch(:media_personalities, []).map do |media_personality_id|
          MediaPersonality.find(media_personality_id)
        end

      source = nil

      Source.transaction do
        source_data[:source_speakers] = source_data.fetch(:source_speakers, []).map do |source_speaker_data|
          SourceSpeaker.create(
            speaker: Speaker.find(source_speaker_data[:speaker_id]),
            first_name: source_speaker_data[:first_name],
            last_name: source_speaker_data[:last_name],
            role: source_speaker_data[:role],
            body: source_speaker_data[:body_id] ? Body.find(source_speaker_data[:body_id]) : nil
          )
        end

        source = Source.create!(source_data)
      end

      { source: }
    end
  end
end
