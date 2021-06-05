# frozen_string_literal: true

module Types
  class InternalOverallStatsType < BaseObject
    field :factual_and_published_statements_count, Int, null: false
    field :speakers_with_factual_and_published_statements_count, Int, null: false
  end
end
