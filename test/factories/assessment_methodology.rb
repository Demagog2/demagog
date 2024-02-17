# frozen_string_literal: true

FactoryBot.define do
  factory :assessment_methodology do
    sequence(:name) { |i| "Methodology #{i}" }
    url { "https://demagog.cz/stranka/jak-hodnotime-metodika" }
    rating_model { AssessmentMethodology::RATING_MODEL_VERACITY }
    rating_keys { [Veracity::TRUE, Veracity::UNTRUE, Veracity::MISLEADING, Veracity::UNVERIFIABLE] }

    trait :promises_legacy do
      rating_model { AssessmentMethodology::RATING_MODEL_PROMISE_RATING }
      rating_keys { [PromiseRating::FULFILLED, PromiseRating::PARTIALLY_FULFILLED, PromiseRating::BROKEN] }
    end

    trait :promises_latest do
      rating_model { AssessmentMethodology::RATING_MODEL_PROMISE_RATING }
      rating_keys { [PromiseRating::FULFILLED, PromiseRating::IN_PROGRESS, PromiseRating::BROKEN, PromiseRating::STALLED] }
    end
  end
end
