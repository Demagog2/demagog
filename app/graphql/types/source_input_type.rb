# frozen_string_literal: true

Types::SourceInputType = GraphQL::InputObjectType.define do
  name "SourceInputType"

  argument :name, !types.String
  argument :released_at, !types.String
  argument :source_url, types.String
  argument :medium_id, !types.ID
  argument :media_personalities, !types[!types.ID]
  argument :transcript, !types.String
  argument :speakers, !types[!types.ID]
  argument :expert_id, types.ID
end
