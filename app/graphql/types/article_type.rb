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
        stats = object.speaker_stats(speaker)
        SpeakerStats.new(speaker, stats)
      end
    end

    field :statements, [Types::StatementType], null: true, description: "If article has source_statements segment, returns statements from that segment", deprecation_reason: "Query statements from article segments" do
      argument :veracity, Types::VeracityKeyType, required: false, default_value: nil
      argument :speaker, Int, required: false, default_value: nil
    end

    def statements(args)
      statements = object.statements

      if statements
        statements = statements.joins(:veracity).where(veracities: { key: args[:veracity] }) if args[:veracity]
        statements = statements.where(speaker_id: args[:speaker]) if args[:speaker]
      end

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
