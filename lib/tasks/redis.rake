# frozen_string_literal: true

namespace :redis do
  desc "Invalidates all cached results"
  task clear: :environment do
    redis = Redis.new

    wildcards = %w{speaker:*:stats source:*:speaker:*:stats}

    wildcards.each do |wildcard|
      keys = redis.keys wildcard

      redis.del keys.join(" ")
    end
  end
end
