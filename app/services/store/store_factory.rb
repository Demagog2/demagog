# frozen_string_literal: true

module Store
  class StoreFactory
    def create(settings)
      if settings.services.redis.enabled
        Redis.new
      else
        HashStore.new
      end
    end
  end
end
