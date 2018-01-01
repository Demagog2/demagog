# frozen_string_literal: true

module Stats::Speaker
  class StatsBuilder
    def initialize(cache)
      @cache = cache
    end

    # Build stats for given speaker
    #
    # @param [Speaker] speaker
    def build(speaker)
      key = cache_key(speaker)

      if @cache.contains?(key)
        @cache.load(key)
      else
        stats = build_stats statements(speaker)

        @cache.save(key, stats)
      end
    end

    private

      # @param [Speaker] speaker
      # @return [Array<Statement>]
      def statements(speaker)
        speaker.statements.relevant_for_statistics
      end

      # @param [Array<Statement>] statements
      def build_stats(statements)
        Stats::StatsAggregation.new.aggregate(statements)
      end

      # @param [Speaker] speaker
      # @return [String]
      def cache_key(speaker)
        "speaker:#{speaker.id}:stats"
      end
  end
end
