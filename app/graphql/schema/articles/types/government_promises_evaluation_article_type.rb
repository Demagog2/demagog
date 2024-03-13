# frozen_string_literal: true

module Schema::Articles::Types
  class GovernmentPromisesEvaluationArticleType < Types::BaseObject
    field :id, ID, null: false
    field :slug, String, null: false
    field :title, String, null: false
    field :perex, String, null: true
    field :promise_count, Integer, null: false
    field :promises, [GovernmentPromiseType], null: false
    field :stats, [PromiseStatsType], null: true
  end
end