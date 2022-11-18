# frozen_string_literal: true

module Schema::Articles::ArticleField
  extend ActiveSupport::Concern

  included do
    field :article, Types::ArticleType, null: false do
      argument :id, GraphQL::Types::ID, required: false
      argument :slug, GraphQL::Types::String, required: false
      argument :include_unpublished, GraphQL::Types::Boolean, default_value: false, required: false
    end

    def article(args)
      if args[:include_unpublished]
        # Public cannot access unpublished articles
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        return Article.kept.friendly.find(args[:slug] || args[:id])
      end

      Article.kept.published.friendly.find(args[:slug] || args[:id])
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new(
        "Could not find Article with id=#{args[:id]} or slug=#{args[:slug]}"
      )
    end
  end
end
