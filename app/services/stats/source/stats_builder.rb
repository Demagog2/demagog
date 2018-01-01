# frozen_string_literal: true

module Stats::Source
  class StatsBuilder
    def initialize(cache)
      @cache = cache
    end

    # Builds stats for speaker within the given source (article)
    #
    # @param [Source] source
    # @param [Speaker] speaker
    def build(source, speaker)
      key = cache_key(source, speaker)

      if @cache.contains?(key)
        @cache.load(key)
      else
        stats = build_stats statements(source, speaker)

        @cache.save(key, stats)
      end
    end

    private

      # @param [Source] source
      # @param [Speaker] speaker
      # @return [Array<Statement>]
      def statements(source, speaker)
        speaker.statements.relevant_for_statistics.where(source_id: source.id)
      end

      # @param [Array<Statement>] statements
      def build_stats(statements)
        Stats::StatsAggregation.new.aggregate(statements)
      end

      # @param [Source] source
      # @param [Speaker] speaker
      # @return [String]
      def cache_key(source, speaker)
        "source:#{source.id}:speaker:#{speaker.id}:stats"
      end
  end
end
