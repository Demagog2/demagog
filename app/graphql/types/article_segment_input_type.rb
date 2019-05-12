# frozen_string_literal: true

module Types
  class ArticleSegmentInputType < GraphQL::Schema::InputObject
    argument :id, ID, required: false
    argument :segment_type, String, required: true
    argument :text_html, String, required: false
    argument :text_slatejson, Types::Scalars::JsonType, required: false
    argument :source_id, ID, required: false
    argument :promise_url, String, required: false
  end
end
