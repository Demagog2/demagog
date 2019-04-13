# frozen_string_literal: true

module Types
  class SourceInputType < GraphQL::Schema::InputObject
    argument :name, String, required: true
    argument :released_at, String, required: true
    argument :source_url, String, required: false
    argument :medium_id, ID, required: true
    argument :media_personalities, [ID], required: true
    argument :transcript, String, required: true
    argument :speakers, [ID], required: true
    argument :expert_id, ID, required: false
  end
end
