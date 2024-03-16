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

    field :articles, [Types::ArticleType], null: true, deprecation_reason: "Deprecated field. Use v2 version instead."  do
      argument :limit, Int, required: false, default_value: 10
      argument :offset, Int, required: false, default_value: 0
    end

    field :articles_v2, Types::ArticleType.connection_type, null: false

    def articles(limit:, offset:)
      articles_v2.limit(limit).offset(offset)
    end

    def articles_v2
      object.articles.published.order(published_at: :desc)
    end
  end
end
