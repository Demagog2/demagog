# frozen_string_literal: true

Types::MembershipInputType = GraphQL::InputObjectType.define do
  name "MembershipInputType"

  argument :id, types.Int
  argument :body_id, !types.Int
  argument :since, types.String
  argument :until, types.String
end
