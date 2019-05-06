# frozen_string_literal: true

class AssessmentMethodology < ApplicationRecord
  RATING_MODEL_VERACITY = "veracity"
  RATING_MODEL_PROMISE_RATING = "promise_rating"

  has_many :assessments
end
