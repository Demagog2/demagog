# frozen_string_literal: true

module Types
  class PageInputType < GraphQL::Schema::InputObject
    argument :title, String, required: true

    argument :text_html, String, required: false
    argument :text_slatejson, Types::Scalars::JsonType, required: false
    argument :published, Boolean, required: false
    argument :slug, String, required: false
  end
end
