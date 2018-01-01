# frozen_string_literal: true

module Stats::Speaker
  class StatsBuilderFactory
    def create(settings)
      StatsBuilder.new(Stats::StatsCache.new(Store::StoreFactory.new.create(settings)))
    end
  end
end
