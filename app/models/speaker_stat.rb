# frozen_string_literal: true

class SpeakerStat < ApplicationRecord
  def self.normalize
    default_stats = {
      Assessment::VERACITY_TRUE => 0,
      Assessment::VERACITY_UNTRUE => 0,
      Assessment::VERACITY_MISLEADING => 0,
      Assessment::VERACITY_UNVERIFIABLE => 0,
    }

    self.all.reduce(default_stats) do |acc, stat|
      acc[stat.key] = stat.count
      acc
    end.symbolize_keys
  end
end
