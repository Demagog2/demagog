# frozen_string_literal: true

namespace :redis do
  desc "Invalidates all cached results"
  task clear: :environment do
    Redis.new.flushall
  end
end
