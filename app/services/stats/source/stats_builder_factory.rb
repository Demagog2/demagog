# frozen_string_literal: true

module Stats::Source
  class StatsBuilderFactory
    def create(settings)
      StatsBuilder.new(Stats::StatsCache.new(Store::StoreFactory.new.create(settings)))
    end
  end
end
