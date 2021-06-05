# frozen_string_literal: true

module Types
  class SourceInputType < GraphQL::Schema::InputObject
    argument :name, String, required: true
    argument :released_at, String, required: false
    argument :source_url, String, required: false
    argument :medium_id, ID, required: false
    argument :media_personalities, [ID], required: false
    argument :transcript, String, required: false
    argument :speakers, [ID], required: false
    argument :experts, [ID], required: false
  end

  class SourceInputVideoFieldsType < GraphQL::Schema::InputObject
    argument :video_type, String, required: true
    argument :video_id, String, required: true
  end
end
