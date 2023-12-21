# frozen_string_literal: true

module Schema::Search::Types
  class VeracityAggregateType < BaseAggregateType
    field :veracity, Types::VeracityType, null: false
  end
end
