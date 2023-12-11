# frozen_string_literal: true

module Schema::Articles::ArticlesField
  extend ActiveSupport::Concern

  included do
    field :articles, [Types::ArticleType], null: false do
      argument :offset, GraphQL::Types::Int, default_value: 0, required: false
      argument :limit, GraphQL::Types::Int, default_value: 10, required: false
      argument :title, GraphQL::Types::String, required: false
      argument :include_unpublished, GraphQL::Types::Boolean, default_value: false, required: false
    end

    field :homepage_articles, [Types::ArticleType], null: false do
      argument :page, GraphQL::Types::Int, default_value: 1, required: false
    end

    def articles(args)
      if args[:include_unpublished]
        # Public cannot access unpublished articles
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        articles = Article.kept
      else
        articles = Article.kept.published
      end

      articles =
        articles.offset(args[:offset]).limit(args[:limit]).order(
          Arel.sql("COALESCE(published_at, created_at) DESC")
        )

      articles = articles.matching_title(args[:title]) if args[:title].present?

      articles
    end

    def homepage_articles(page:)
      Article.kept.published.for_homepage.order(published_at: :desc).page(page).per(10)
    end
  end
end
