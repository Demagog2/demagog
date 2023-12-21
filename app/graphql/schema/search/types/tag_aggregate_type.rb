# frozen_string_literal: true

module Schema::Search::Types
  class TagAggregateType < BaseAggregateType
    field :tag, Types::TagType, null: false
  end
end
