# frozen_string_literal: true

module Stats
  class StatsCache
    def initialize(store)
      @store = store
    end

    def contains?(key)
      @store.get(key).present?
    end

    def save(key, stats)
      @store.set(key, stats.to_json)

      stats
    end

    def load(key)
      record = @store.get(key)

      JSON.parse(record, symbolize_names: true)
    end
  end
end
