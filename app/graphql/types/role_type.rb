# frozen_string_literal: true

Types::RoleType = GraphQL::ObjectType.define do
  name "Role"

  field :id, !types.ID
  field :key, !types.String
  field :name, !types.String
end
