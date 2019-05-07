# frozen_string_literal: true

# It would be much prettier to do the VeracityKeyType using enum
# like at the end of this comment, but there is a problem with the
# "true" value. graphql-ruby does not allow enum value "true". What
# do we do about it?
#
# module Types
#   class VeracityKeyType < BaseEnum
#     value Veracity::TRUE
#     value Veracity::UNTRUE
#     value Veracity::MISLEADING
#     value Veracity::UNVERIFIABLE
#   end
# end

Types::VeracityKeyType = GraphQL::ScalarType.define do
  name "VeracityKey"
  description "Assessment veracity – can be either true, untrue, misleading or unverifiable"

  VERACITY_KEY_VALUES = [
    Veracity::TRUE,
    Veracity::UNTRUE,
    Veracity::MISLEADING,
    Veracity::UNVERIFIABLE
  ]

  coerce_input ->(value, ctx) do
    unless VERACITY_KEY_VALUES.include?(value)
      raise GraphQL::CoercionError, "Cannot coerce #{value.inspect} to veracity. \
Known values are true, untrue, misleading or unverifiable."
    end

    value
  end

  coerce_result ->(value, ctx) { value.to_s }
end
