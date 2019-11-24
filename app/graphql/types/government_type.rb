# frozen_string_literal: true

module Types
  class GovernmentType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :ministers, [Types::MinisterType], null: false
  end
end
