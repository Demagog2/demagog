# frozen_string_literal: true

module Types
  class SpeakerInputType < GraphQL::Schema::InputObject
    argument :first_name, String, required: true
    argument :last_name, String, required: true
    argument :website_url, String, required: false
    argument :memberships, [Types::MembershipInputType], required: true
  end
end
