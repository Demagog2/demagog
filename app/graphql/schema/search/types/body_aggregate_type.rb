# frozen_string_literal: true

module Schema::Search::Types
  class BodyAggregateType < BaseAggregateType
    field :body, Types::BodyType, null: false
  end
end
