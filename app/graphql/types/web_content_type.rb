# frozen_string_literal: true

module Types
  class WebContentType < BaseObject
    field :id, ID, null: false
    field :system_id, String, null: false
    field :name, String, null: false
    field :url_path, String, null: false
    field :dynamic_page, Boolean, null: false
    field :dynamic_page_published, Boolean, null: false
    field :structure, GraphQL::Types::JSON, null: false
    field :data, GraphQL::Types::JSON, null: false
  end
end
