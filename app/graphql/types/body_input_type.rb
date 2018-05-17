# frozen_string_literal: true

Types::BodyInputType = GraphQL::InputObjectType.define do
  name "BodyInputType"

  argument :name, !types.String
  argument :is_party, !types.Boolean
  argument :is_inactive, !types.Boolean

  argument :short_name, types.String
  argument :link, types.String

  argument :founded_at, types.String
  argument :terminated_at, types.String
end
