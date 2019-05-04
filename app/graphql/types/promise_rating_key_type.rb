# frozen_string_literal: true

Types::PromiseRatingKeyType = GraphQL::ScalarType.define do
  name "PromiseRatingKey"
  description "Assessment promise rating – can be either fulfilled, partially_fufilled, broken or stalled"

  KNOWN_TYPES = [
    PromiseRating::FULFILLED,
    PromiseRating::PARTIALLY_FULFILLED,
    PromiseRating::BROKEN,
    PromiseRating::STALLED
  ]

  coerce_input ->(value, ctx) do
    unless KNOWN_TYPES.include?(value)
      raise GraphQL::CoercionError, "cannot coerce `#{value.inspect}` to promise rating. \
Known values are fulfilled, partially_fufilled, broken or stalled"
    end

    value
  end

  coerce_result ->(value, ctx) { value.to_s }
end
