# frozen_string_literal: true

Types::MediumInputType = GraphQL::InputObjectType.define do
  name "MediumInputType"

  argument :name, !types.String
  argument :media_personalities, !types[Types::MediumMediaPersonalitiesInputType]
end

Types::MediumMediaPersonalitiesInputType = GraphQL::InputObjectType.define do
  name "MediumMediaPersonalitiesInputType"

  argument :media_personality_id, !types.ID
end
