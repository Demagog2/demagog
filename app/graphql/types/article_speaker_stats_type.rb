# frozen_string_literal: true

Types::ArticleSpeakerStatsType = GraphQL::ObjectType.define do
  name "ArticleSpeakerStats"

  field :speaker, !Types::SpeakerType
  field :stats, !Types::StatsType
end
