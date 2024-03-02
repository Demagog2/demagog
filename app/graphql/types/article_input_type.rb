# frozen_string_literal: true

module Types
  class ArticleInputType < GraphQL::Schema::InputObject
    argument :article_type, String, required: true
    argument :title, String, required: true
    argument :title_en, String, required: false
    argument :perex, String, required: false
    argument :segments, [Types::ArticleSegmentInputType], required: true

    argument :slug, String, required: false
    argument :published, Boolean, required: false
    argument :published_at, String, required: false
    argument :source_id, ID, required: false
    argument :article_tags, [ID], required: false

    argument :assessment_methodology_id, ID, required: false
  end
end
