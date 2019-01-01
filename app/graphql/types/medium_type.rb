# frozen_string_literal: true

Types::MediumType = GraphQL::ObjectType.define do
  name "Medium"

  field :id, !types.ID
  field :name, !types.String
end
