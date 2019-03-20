# frozen_string_literal: true

module Types
  class PageType < BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :slug, String, null: false
    field :published, Boolean, null: false
    field :text_html, String, null: true
    field :text_slatejson, Types::Scalars::JsonType, null: true
  end
end
