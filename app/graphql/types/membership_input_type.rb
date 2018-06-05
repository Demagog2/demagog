# frozen_string_literal: true

Types::MembershipInputType = GraphQL::InputObjectType.define do
  name "MembershipInputType"

  argument :id, types.ID
  argument :since, types.String
  argument :until, types.String
  argument :body, Types::MembershipBodyInputType
end
