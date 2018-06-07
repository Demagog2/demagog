# frozen_string_literal: true

Types::SourceType = GraphQL::ObjectType.define do
  name "Source"

  field :id, !types.ID
  field :name, !types.String
  field :released_at, !types.String
  field :source_url, types.String
  field :transcript, types.String
  field :medium, Types::MediumType
  field :media_personality, Types::MediaPersonalityType
end
