class ArticleStat < ApplicationRecord
  def self.normalize
    default_stats = {
      Veracity::TRUE => 0,
      Veracity::UNTRUE => 0,
      Veracity::MISLEADING => 0,
      Veracity::UNVERIFIABLE => 0,
    }

    self.all.reduce(default_stats) do |acc, stat|
      acc[stat.key] = stat.count
      acc
    end.symbolize_keys
  end
end
