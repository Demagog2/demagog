# frozen_string_literal: true

module Types
  class AssessmentMethodologyType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :url, String, null: true
    field :rating_model, Types::AssessmentMethodologyRatingModelType, null: false
    field :rating_keys, [String], null: false
  end
end
