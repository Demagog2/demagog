# frozen_string_literal: true

Types::SegmentInputType = GraphQL::InputObjectType.define do
  name "SegmentInputType"

  argument :id, types.ID
  argument :segment_type, !types.String
  argument :text_html, types.String
  argument :text_slatejson, Types::Scalars::JsonType
  argument :source_id, types.ID
end
