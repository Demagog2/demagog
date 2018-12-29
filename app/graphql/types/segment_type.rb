# frozen_string_literal: true

Types::SegmentType = GraphQL::ObjectType.define do
  name "Segment"

  field :id, !types.ID
  field :segment_type, !types.String
  field :text_html, types.String
  field :text_slatejson, Types::Scalars::JsonType
  field :source, Types::SourceType

  field :statements, !types[!Types::StatementType] do
    resolve -> (obj, args, ctx) do
      obj.all_published_statements
    end
  end
end
