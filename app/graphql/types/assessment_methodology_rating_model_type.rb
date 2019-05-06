# frozen_string_literal: true

Types::AssessmentMethodologyRatingModelType = GraphQL::ScalarType.define do
    name "AssessmentMethodologyRatingModelType"
    description "Assessment methodology rating model type – can be either veracity or promise_rating"

    ASSESSMENT_METHODOLOGY_RATING_MODEL_TYPE_VALUES = [
      AssessmentMethodology::RATING_MODEL_VERACITY,
      AssessmentMethodology::RATING_MODEL_PROMISE_RATING
    ]

    coerce_input ->(value, ctx) do
      unless ASSESSMENT_METHODOLOGY_RATING_MODEL_TYPE_VALUES.include?(value)
        raise GraphQL::CoercionError, "Cannot coerce #{value.inspect} to assessment methodology rating model type. \
  Known values are veracity or promise_rating."
      end

      value
    end

    coerce_result ->(value, ctx) { value.to_s }
  end
