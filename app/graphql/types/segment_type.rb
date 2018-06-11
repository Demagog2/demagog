# frozen_string_literal: true

Types::SegmentType = GraphQL::ObjectType.define do
  name "Segment"

  field :id, !types.ID
  field :segment_type, !types.String
  field :text, types.String
end
