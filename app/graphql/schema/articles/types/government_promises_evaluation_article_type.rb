# frozen_string_literal: true

module Schema::Articles::Types
  class GovernmentPromisesEvaluationArticleType < Types::BaseObject
    field :id, ID, null: false
    field :slug, String, null: false
    field :title, String, null: false
    field :promise_count, Integer, null: false
    field :promises, [Types::StatementType], null: false
  end
end
