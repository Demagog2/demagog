# frozen_string_literal: true

Types::StatementTypeType = GraphQL::ScalarType.define do
  name "StatementType"
  description "Statement type – can be either factual or promise"

  STATEMENT_TYPE_VALUES = [
    Statement::TYPE_FACTUAL,
    Statement::TYPE_PROMISE
  ]

  coerce_input ->(value, ctx) do
    unless STATEMENT_TYPE_VALUES.include?(value)
      raise GraphQL::CoercionError, "Cannot coerce #{value.inspect} to statement type. \
Known values are factual or promise."
    end

    value
  end

  coerce_result ->(value, ctx) { value.to_s }
end
