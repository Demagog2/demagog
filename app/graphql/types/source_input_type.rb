# frozen_string_literal: true

Types::SourceInputType = GraphQL::InputObjectType.define do
  name "SourceInputType"

  argument :name, !types.String
  argument :released_at, !types.String
  argument :source_url, types.String
  argument :medium_id, types.ID
  argument :media_personality_id, types.ID
  argument :transcript, !types.String
end
