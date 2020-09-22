# frozen_string_literal: true

module Types
  class WebContentInputType < GraphQL::Schema::InputObject
    argument :name, String, required: false
    argument :url_path, String, required: false
    argument :dynamic_page, Boolean, required: false
    argument :dynamic_page_published, Boolean, required: false
    argument :data, GraphQL::Types::JSON, required: false
  end
end
