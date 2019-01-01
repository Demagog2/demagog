# frozen_string_literal: true

Types::MediumInputType = GraphQL::InputObjectType.define do
  name "MediumInputType"

  argument :name, !types.String
end
