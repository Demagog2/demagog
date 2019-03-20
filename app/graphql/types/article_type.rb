# frozen_string_literal: true

module Types
  SpeakerStats = Struct.new(:speaker, :stats)

  class ArticleType < BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :slug, String, null: false
    field :perex, String, null: true
    field :published_at, Types::Scalars::DateTimeType, null: true
    field :published, Boolean, null: false
    field :source, Types::SourceType, null: true

    field :article_type, String, null: false

    def article_type
      object.article_type.name
    end

    field :speakers, [Types::SpeakerType], null: true

    def speakers
      object.unique_speakers
    end

    field :debate_stats, [Types::ArticleSpeakerStatsType], null: true

    def debate_stats
      object.unique_speakers.map do |speaker|
        stats = Stats::Source::StatsBuilderFactory.new.create(Settings).build(object.source, speaker)
        SpeakerStats.new(speaker, stats)
      end
    end

    field :statements, [Types::StatementType], null: true do
      argument :veracity, Types::VeracityKeyType, required: false
      argument :speaker, Int, required: false
    end

    def statements(args)
      statements = object.statements.published
      statements = statements.joins(:veracities).where(veracities: { key: args[:veracity] }) if args[:veracity]
      statements = statements.where(speaker_id: args[:speaker]) if args[:speaker]

      statements
    end

    field :illustration, String, null: true

    def illustration
      return nil unless object.illustration.attached?

      Rails.application.routes.url_helpers.polymorphic_url(object.illustration, only_path: true)
    end

    field :segments, [Types::ArticleSegmentType], null: false

    def segments
      object.segments.ordered
    end
  end
end
