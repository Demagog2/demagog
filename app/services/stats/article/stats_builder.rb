# frozen_string_literal: true

module Stats::Article
  class StatsBuilder
    def initialize(cache)
      @cache = cache
    end

    # Builds stats for speaker within the given source (article)
    #
    # @param [Article] article
    # @param [Speaker] speaker
    def build(article, speaker)
      key = cache_key(article, speaker)

      if @cache.contains?(key)
        @cache.load(key)
      else
        stats = build_stats statements(article, speaker)

        @cache.save(key, stats)
      end
    end

    def invalidate(article)
      article.segments.source_statements_type_only.each do |segment|
        segment.source.speakers.each do |speaker|
          key = cache_key(article, speaker)

          @cache.del(key)
        end
      end
    end

    private

      # @param [Article] article
      # @param [Speaker] speaker
      # @return [Array<Statement>]
      def statements(article, speaker)
        result = []

        article.segments.source_statements_type_only.each do |segment|
          # When invalidating, we are using the source.speakers list, so
          # we use the same list also here to be consistent
          return unless segment.source.speakers.include?(speaker)

          result << segment.source.statements.relevant_for_statistics.where(speaker_id: speaker.id).all
        end

        result
      end

      # @param [Array<Statement>] statements
      def build_stats(statements)
        Stats::StatsAggregation.new.aggregate(statements)
      end

      # @param [Article] article
      # @param [Speaker] speaker
      # @return [String]
      def cache_key(article, speaker)
        "article:#{article.id}:speaker:#{speaker.id}:stats"
      end
  end
end
