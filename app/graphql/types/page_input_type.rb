# frozen_string_literal: true

Types::PageInputType = GraphQL::InputObjectType.define do
  name "PageInputType"

  argument :title, !types.String
  argument :slug, types.String
  argument :published, types.Boolean
  argument :text_html, types.String
  argument :text_slatejson, Types::Scalars::JsonType
end
