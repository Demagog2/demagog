# frozen_string_literal: true

module Schema::Articles::Types
  class PromiseStatsType < Types::BaseObject
    field :key, String, null: false
    field :count, Int, null: false
    field :percentage, Int, null: false
  end
end
