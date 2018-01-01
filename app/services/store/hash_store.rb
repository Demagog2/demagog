# frozen_string_literal: true

module Store
  class HashStore
    def initialize
      @storage = {}
    end

    def get(key)
      @storage[key]
    end

    def set(key, value)
      @storage[key] = value
    end
  end
end
