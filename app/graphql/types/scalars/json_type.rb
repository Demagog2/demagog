# frozen_string_literal: true

Types::Scalars::JsonType = GraphQL::ScalarType.define do
  name "JsonType"

  coerce_input ->(value, ctx) {
    value
  }
  coerce_result ->(value, ctx) {
    JSON.parse(value)
  }
end
