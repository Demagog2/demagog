# frozen_string_literal: true

module Types
  class MinisterType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :ordering, Int, null: true
    field :speaker, Types::SpeakerType, null: false
  end
end
