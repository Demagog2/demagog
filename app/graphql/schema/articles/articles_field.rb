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

    field :government_promises_evaluations, [Schema::Articles::Types::GovernmentPromisesEvaluationArticleType], null: false

    field :facebook_factchecks, Types::ArticleType.connection_type, null: false

    def articles(args)
      if args[:include_unpublished]
        # Public cannot access unpublished articles
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        articles = Article.kept
      else
        articles = Article.kept.published
      end

      article_type = Flipper.enabled?("government_promises_evaluations", context[:current_user]) ?
                        [
                         Article::ARTICLE_TYPE_DEFAULT,
                         Article::ARTICLE_TYPE_STATIC,
                         Article::ARTICLE_TYPE_SINGLE_STATEMENT,
                         Article::ARTICLE_TYPE_FACEBOOK_FACTCHECK,
                         Article::ARTICLE_TYPE_GOVERNMENT_PROMISES_EVALUATION,
                        ] : [
                          Article::ARTICLE_TYPE_DEFAULT,
                          Article::ARTICLE_TYPE_STATIC,
                          Article::ARTICLE_TYPE_SINGLE_STATEMENT,
                          Article::ARTICLE_TYPE_FACEBOOK_FACTCHECK,
                        ]

      articles =
        articles.where(article_type:).offset(args[:offset]).limit(args[:limit]).order(
          Arel.sql("COALESCE(published_at, created_at) DESC")
        )

      articles = articles.matching_title(args[:title]) if args[:title].present?

      articles
    end

    def homepage_articles(page:)
      Article.kept.published.for_homepage.order(published_at: :desc).page(page).per(10)
    end

    def government_promises_evaluations
      Article.published.where(article_type: Article::ARTICLE_TYPE_GOVERNMENT_PROMISES_EVALUATION).order(published_at: :desc).map do |article|
        GovernmentPromisesEvaluation.new(article:)
      end
    end

    def facebook_factchecks
      Article.published.where(article_type: Article::ARTICLE_TYPE_FACEBOOK_FACTCHECK).order(published_at: :desc)
    end
  end
end
