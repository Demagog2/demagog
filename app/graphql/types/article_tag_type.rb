# frozen_string_literal: true

module Types
  class ArticleTagType < BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :slug, String, null: false
    field :icon, String, null: false
    field :description, String, null: true
    field :video, String, null: true
    field :published, Boolean, null: true
    field :stats, String, null: true
    field :order, String, null: false
  end
end
