# frozen_string_literal: true

module Schema::Articles::Types
  class BaseArticleType < Types::BaseObject
    field :id, ID, null: false
    field :slug, String, null: false
    field :title, String, null: false
    field :illustration, String, null: true do
      argument :size, Schema::Articles::Types::ArticleImageSizeType, required: false, description: "Experimental"
    end

    def illustration(size: nil)
      return nil unless object.illustration.attached?

      if size == Article::ILLUSTRATION_SIZE_MEDIUM
        Rails.application.routes.url_helpers.rails_representation_url(object.illustration.variant(:medium).processed, only_path: true)
      else
        Rails.application.routes.url_helpers.polymorphic_url(object.illustration, only_path: true)
      end
    end
  end
end
