# frozen_string_literal: true

require "json"

Types::Scalars::JsonType = GraphQL::ScalarType.define do
  name "JSON"

  coerce_input ->(value, ctx) {
    value.to_h.to_json
  }
  coerce_result ->(value, ctx) {
    JSON.parse(value)
  }
end
