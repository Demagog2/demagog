# frozen_string_literal: true

module Types
  class MembershipInputType < GraphQL::Schema::InputObject
    argument :id, ID, required: false
    argument :since, String, required: false
    argument :until, String, required: false
    argument :body_id, ID, required: true
  end
end
