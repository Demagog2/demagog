# frozen_string_literal: true

module Types
  class PromiseRatingType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :key, Types::PromiseRatingKeyType, null: false
  end
end
