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

      p statements(article, speaker)

      if @cache.contains?(key)
        @cache.load(key)
      else
        stats = build_stats statements(article, speaker)

        @cache.save(key, stats)
      end
    end

    private

      # @param [Article] article
      # @param [Speaker] speaker
      # @return [Array<Statement>]
      def statements(article, speaker)
        speaker.statements.relevant_for_statistics
          .joins(:articles).where(articles: { id: [article.id] })
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
