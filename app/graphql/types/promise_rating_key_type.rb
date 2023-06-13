# frozen_string_literal: true

module Types
  class PromiseRatingKeyType < BaseEnum
    value PromiseRating::FULFILLED
    value PromiseRating::IN_PROGRESS
    value PromiseRating::PARTIALLY_FULFILLED
    value PromiseRating::BROKEN
    value PromiseRating::STALLED
    value PromiseRating::NOT_YET_EVALUATED
  end
end
