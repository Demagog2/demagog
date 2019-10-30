# frozen_string_literal: true

module Mutations
  class UpdateSourceVideoFields < GraphQL::Schema::Mutation
    description "Update source video fields"

    field :source, Types::SourceType, null: false

    argument :id, ID, required: true
    argument :source_video_fields_input, Types::SourceInputVideoFieldsType, required: true

    def resolve(id:, source_video_fields_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, %w[sources:edit])

      source = source_video_fields_input.to_h

      { source: Source.update(id, source) }
    end
  end
end
