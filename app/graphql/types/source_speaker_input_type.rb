# frozen_string_literal: true

module Types
  class SourceSpeakerInputType < GraphQL::Schema::InputObject
    argument :id, ID, required: false
    argument :speaker_id, ID, required: true
    argument :first_name, String, required: true
    argument :last_name, String, required: true
    argument :role, String, required: false
    argument :body_id, ID, required: false
  end
end
