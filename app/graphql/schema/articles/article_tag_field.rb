# frozen_string_literal: true

module Schema::Articles::ArticleTagField
  extend ActiveSupport::Concern

  included do
    field :article_tag, Types::ArticleTagType, null: false do
      argument :id, GraphQL::Types::ID, required: true
    end

    field :article_tag_by_slug, Types::ArticleTagType, null: true do
      argument :slug, GraphQL::Types::String, required: true
    end

    def article_tag(id:)
      ArticleTag.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find ArticleTag with id=#{id}")
    end

    def article_tag_by_slug(slug:)
      ArticleTag.published.find_by(slug:)
    end
  end
end
