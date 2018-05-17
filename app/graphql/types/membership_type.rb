# frozen_string_literal: true

Types::MembershipType = GraphQL::ObjectType.define do
  name "Membership"

  field :id, !types.ID
  field :body, !Types::BodyType
  field :since, types.String
  field :until, types.String
end
