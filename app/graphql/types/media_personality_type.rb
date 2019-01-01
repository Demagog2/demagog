# frozen_string_literal: true

Types::MediaPersonalityType = GraphQL::ObjectType.define do
  name "MediaPersonality"

  field :id, !types.ID
  field :name, !types.String
end
