# frozen_string_literal: true

SpeakerStats = Struct.new(:speaker, :stats)

Types::ArticleType = GraphQL::ObjectType.define do
  name "Article"

  field :id, !types.ID
  field :title, !types.String
  field :slug, !types.String
  field :perex, types.String
  field :published_at, !types.String
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
        SpeakerStats.new(speaker, speaker.stats_for_debate(obj))
      end
    }
  end

  field :statements, types[Types::StatementType] do
    argument :veracity, Types::VeracityKeyType
    argument :speaker, types.Int

    resolve -> (obj, args, ctx) do
      statements = obj.statements.where(published: true).order(excerpted_at: "asc")
      statements = statements.joins(:veracities).where(veracities: { key: args[:veracity] }) if args[:veracity]
      statements = statements.where(speaker_id: args[:speaker]) if args[:speaker]

      statements
    end
  end

  field :illustration, types.String do
    resolve -> (obj, args, ctx) do
      return nil if obj.illustration.file.empty?

      folder = obj.article_type.name === "static" ? "pages" : "diskusia"

      "/data/#{folder}/s/#{obj.illustration.file}"
    end
  end
end
