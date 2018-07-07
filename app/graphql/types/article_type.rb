# frozen_string_literal: true

SpeakerStats = Struct.new(:speaker, :stats)

Types::ArticleType = GraphQL::ObjectType.define do
  name "Article"

  field :id, !types.ID
  field :title, !types.String
  field :slug, !types.String
  field :perex, types.String
  field :published_at, Types::Scalars::DateTimeType
  field :published, !types.Boolean
  field :source, Types::SourceType

  field :article_type, !types.String do
    resolve ->(obj, args, ctx) {
      obj.article_type.name
    }
  end

  field :speakers, types[Types::SpeakerType] do
    resolve -> (obj, args, ctx) {
      obj.unique_speakers
    }
  end

  field :debate_stats, types[Types::ArticleSpeakerStatsType] do
    resolve -> (obj, args, ctx) {
      obj.unique_speakers.map do |speaker|
        stats = Stats::Source::StatsBuilderFactory.new.create(Settings).build(obj.source, speaker)
        SpeakerStats.new(speaker, stats)
      end
    }
  end

  field :statements, types[Types::StatementType] do
    argument :veracity, Types::VeracityKeyType
    argument :speaker, types.Int

    resolve -> (obj, args, ctx) do
      statements = obj.statements.published
      statements = statements.joins(:veracities).where(veracities: { key: args[:veracity] }) if args[:veracity]
      statements = statements.where(speaker_id: args[:speaker]) if args[:speaker]

      statements
    end
  end

  field :illustration, types.String do
    resolve -> (obj, args, ctx) do
      return nil unless obj.illustration.attached?

      Rails.application.routes.url_helpers.rails_blob_path(obj.illustration, only_path: true)
    end
  end

  field :segments, types[!Types::SegmentType] do
    resolve -> (obj, args, ctx) do
      obj.segments
    end
  end
end
