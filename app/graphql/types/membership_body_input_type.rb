# frozen_string_literal: true

Types::MembershipBodyInputType = GraphQL::InputObjectType.define do
  name "MembershipBodyInputType"

  argument :id, types.ID
end
