# frozen_string_literal: true

module Mutations
  class CreateSource < GraphQL::Schema::Mutation
    description "Add new source"

    field :source, Types::SourceType, null: false

    argument :source_input, Types::SourceInputType, required: true

    def resolve(source_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, %w[sources:edit])

      source = source_input.to_h

      source[:experts] = source.fetch(:experts, []).map { |user_id| User.find(user_id) }

      source[:speakers] = source.fetch(:speakers, []).map { |speaker_id| Speaker.find(speaker_id) }

      source[:media_personalities] =
        source.fetch(:media_personalities, []).map do |media_personality_id|
          MediaPersonality.find(media_personality_id)
        end

      { source: Source.create!(source) }
    end
  end
end
