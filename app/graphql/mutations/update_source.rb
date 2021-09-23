# frozen_string_literal: true

module Mutations
  class UpdateSource < GraphQL::Schema::Mutation
    description "Update existing source"

    field :source, Types::SourceType, null: false

    argument :id, ID, required: true
    argument :source_input, Types::SourceInputType, required: true

    def resolve(id:, source_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["sources:edit"])

      source_data = source_input.to_h
      source = Source.find(id)

      source_data[:experts] = source_data[:experts].map do |user_id|
        User.find(user_id)
      end

      source_data[:media_personalities] = source_data[:media_personalities].map do |media_personality_id|
        MediaPersonality.find(media_personality_id)
      end

      Source.transaction do
        create_and_update_source_speakers_data = source_data[:source_speakers]
        delete_source_speakers = source.source_speakers.select { |source_speaker| !source_data[:source_speakers].map { |ss| ss[:id] }.select { |id| !id.nil? }.include?(source_speaker.id.to_s) }
        source_data.delete(:source_speakers)

        create_and_update_source_speakers_data.each do |source_speaker_data|
          source_speaker = source_speaker_data[:id] ? SourceSpeaker.find(source_speaker_data[:id]) : SourceSpeaker.new(source_id: source.id)

          # Check that we are not removing source speaker from different source
          if source_speaker.source_id != source.id
            raise Exception.new("Passed id of source speaker who belongs to different source")
          end

          source_speaker.assign_attributes(
            speaker: Speaker.find(source_speaker_data[:speaker_id]),
            first_name: source_speaker_data[:first_name],
            last_name: source_speaker_data[:last_name],
            role: source_speaker_data[:role],
            body: source_speaker_data[:body_id] ? Body.find(source_speaker_data[:body_id]) : nil
          )

          source_speaker.save!
        end

        delete_source_speakers.each do |source_speaker|
          if Statement.unscoped.where(source_speaker_id: source_speaker.id).length > 0
            raise GraphQL::ExecutionError, "Cannot remove source speaker who has already some statements"
            raise Exception.new("Cannot remove source speaker who has already some statements")
          end

          source_speaker.delete
        end

        source = Source.update(id, source_data)
      end

      { source: source }
    end
  end
end
