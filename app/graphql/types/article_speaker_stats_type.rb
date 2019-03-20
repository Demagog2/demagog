# frozen_string_literal: true

module Types
  class ArticleSpeakerStatsType < BaseObject
    field :speaker, Types::SpeakerType, null: true
    field :stats, Types::StatsType , null: true
  end
end
