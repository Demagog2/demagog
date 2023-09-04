# frozen_string_literal: true

module Types
  class ArticleTagInputType < GraphQL::Schema::InputObject
    argument :title, String, required: true
    argument :slug, String, required: true
    argument :description, String, required: false
    argument :icon, String, required: false
    argument :published, Boolean, required: false
    argument :stats, String, required: false
    argument :medium_id,  String, required: false
    argument :video,  String, required: false
    argument :order,  String, required: false
  end
end
