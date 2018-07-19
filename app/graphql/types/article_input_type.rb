# frozen_string_literal: true

Types::ArticleInputType = GraphQL::InputObjectType.define do
  name "ArticleInputType"

  argument :article_type, !types.String
  argument :title, !types.String
  argument :perex, !types.String
  argument :slug, types.String
  argument :published, types.Boolean
  argument :published_at, types.String
  argument :segments, types[!Types::SegmentInputType]
  argument :source_id, types.ID
end
