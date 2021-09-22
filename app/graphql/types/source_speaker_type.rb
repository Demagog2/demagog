# frozen_string_literal: true

module Types
  class SourceSpeakerType < BaseObject
    field :id, ID, null: false
    field :speaker, Types::SpeakerType, null: false
    field :first_name, String, null: false
    field :last_name, String, null: false
    field :body, Types::BodyType, null: true
    field :role, String, null: true
  end
end
