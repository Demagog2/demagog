# frozen_string_literal: true

module Types
  class RoleType < BaseObject
    field :id, ID, null: false
    field :key, String, null: false
    field :name, String, null: false
    field :permissions, [String], null: false
  end
end
