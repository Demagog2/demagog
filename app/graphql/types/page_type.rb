# frozen_string_literal: true

Types::PageType = GraphQL::ObjectType.define do
  name "Page"

  field :id, !types.ID
  field :title, !types.String
  field :slug, !types.String
  field :published, !types.Boolean
  field :text_html, types.String
  field :text_slatejson, Types::Scalars::JsonType
end
