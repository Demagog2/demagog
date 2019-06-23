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

      source = source_input.to_h

      source[:experts] = source[:experts].map do |user_id|
        User.find(user_id)
      end

      source[:speakers] = source[:speakers].map do |speaker_id|
        Speaker.find(speaker_id)
      end

      source[:media_personalities] = source[:media_personalities].map do |media_personality_id|
        MediaPersonality.find(media_personality_id)
      end

      { source: Source.update(id, source) }
    end
  end
end
