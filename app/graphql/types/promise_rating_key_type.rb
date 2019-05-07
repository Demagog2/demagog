# frozen_string_literal: true

Types::PromiseRatingKeyType = GraphQL::ScalarType.define do
  name "PromiseRatingKey"
  description "Assessment promise rating – can be either fulfilled, in_progress, partially_fufilled, broken or stalled"

  PROMISE_RATING_KEY_VALUES = [
    PromiseRating::FULFILLED,
    PromiseRating::IN_PROGRESS,
    PromiseRating::PARTIALLY_FULFILLED,
    PromiseRating::BROKEN,
    PromiseRating::STALLED
  ]

  coerce_input ->(value, ctx) do
    unless PROMISE_RATING_KEY_VALUES.include?(value)
      raise GraphQL::CoercionError, "Cannot coerce #{value.inspect} to promise rating. \
Known values are fulfilled, in_progress, partially_fufilled, broken or stalled."
    end

    value
  end

  coerce_result ->(value, ctx) { value.to_s }
end
