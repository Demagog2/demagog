# frozen_string_literal: true

Types::SpeakerInputType = GraphQL::InputObjectType.define do
  name "SpeakerInputType"

  argument :first_name, !types.String
  argument :last_name, !types.String
  argument :website_url, types.String

  argument :memberships, !types[Types::MembershipInputType]
end
