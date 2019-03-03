# frozen_string_literal: true

Types::ArticleSegmentInputType = GraphQL::InputObjectType.define do
  name "ArticleSegmentInputType"

  argument :id, types.ID
  argument :segment_type, !types.String
  argument :text_html, types.String
  argument :text_slatejson, Types::Scalars::JsonType
  argument :source_id, types.ID
end
