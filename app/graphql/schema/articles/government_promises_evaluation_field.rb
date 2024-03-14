# frozen_string_literal: true

module Schema::Articles::GovernmentPromisesEvaluationField
  extend ActiveSupport::Concern

  included do
    field :government_promises_evaluation_by_slug, Schema::Articles::Types::GovernmentPromisesEvaluationArticleType, null: true do
      argument :slug, GraphQL::Types::String, required: true
    end

    def government_promises_evaluation_by_slug(slug:)
      article = Article.published.find_by(slug:)

      return nil unless article

      GovernmentPromisesEvaluation.new(
        article:
      )
    end
  end
end
