# frozen_string_literal: true

class PromiseRating < ApplicationRecord
  FULFILLED = "fulfilled"
  IN_PROGRESS = "in_progress"
  PARTIALLY_FULFILLED = "partially_fulfilled"
  BROKEN = "broken"
  STALLED = "stalled"
  NOT_YET_EVALUATED = "not_yet_evaluated"

  has_many :assessments
end
