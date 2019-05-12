# frozen_string_literal: true

module Types
  class MembershipType < BaseObject
    field :id, ID, null: false
    field :body, Types::BodyType, null: false
    field :since, String, null: true
    field :until, String, null: true
  end
end
