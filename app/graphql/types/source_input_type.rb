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
    argument :experts, [ID], required: true
  end

  class SourceInputVideoFieldsType < GraphQL::Schema::InputObject
    argument :video_type, String, required: true
    argument :video_id, String, required: true
  end
end
