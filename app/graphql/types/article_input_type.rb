# frozen_string_literal: true

Types::ArticleInputType = GraphQL::InputObjectType.define do
  name "ArticleInputType"

  argument :title, !types.String
  argument :perex, !types.String
  argument :slug, types.String
  argument :published, types.Boolean
  argument :published_at, types.String
  argument :segments, types[!Types::SegmentInputType]
end

# FIXME: Move to own file
Types::SegmentInputType = GraphQL::InputObjectType.define do
  name "SegmentInputType"

  argument :id, types.ID
  argument :segment_type, !types.String
  argument :text, types.String
  argument :statements, types[!types.ID]
end
