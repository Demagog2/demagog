# frozen_string_literal: true

Types::MediaPersonalityInputType = GraphQL::InputObjectType.define do
  name "MediaPersonalityInputType"

  argument :name, !types.String
end
