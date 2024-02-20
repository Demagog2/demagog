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

    field :assessment_methodology, Types::AssessmentMethodologyType, null: true

    field :speakers, [Types::SourceSpeakerType], null: true

    def speakers
      article_presenter = ArticlePresenter.new(object)
      article_presenter.factcheck_source_speakers
    end

    field :articleTags, [Types::ArticleTagType], null: false

    def articleTags
      object.article_tags
    end

    field :debate_stats, [Types::ArticleSpeakerStatsType], null: true

    def debate_stats
      article_presenter = ArticlePresenter.new(object)

      article_presenter.factcheck_source_speakers.map do |source_speaker|
        stats = article_presenter.factcheck_source_speaker_stats(source_speaker)
        SpeakerStats.new(source_speaker.speaker, stats)
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

    field :illustration, String, null: true do
      argument :size, Schema::Articles::Types::ArticleImageSizeType, required: false, description: "Experimental"
    end

    def illustration(size: nil)
      return nil unless object.illustration.attached?

      if size == Article::ILLUSTRATION_SIZE_MEDIUM
        Rails.application.routes.url_helpers.rails_representation_url(object.illustration.variant(:medium).processed, only_path: true)
      else
        Rails.application.routes.url_helpers.polymorphic_url(object.illustration, only_path: true)
      end
    end

    field :segments, [Types::ArticleSegmentType], null: false

    def segments
      object.segments.ordered
    end
  end
end
