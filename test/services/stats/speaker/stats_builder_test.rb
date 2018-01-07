# frozen_string_literal: true

require "test_helper"

class SpeakerStatsBuilderTest < ActiveSupport::TestCase
  test "building speaker stats" do
    stats_builder = Stats::Speaker::StatsBuilder.new Stats::StatsCache.new Store::HashStore.new

    expected_stats = {
      true: 1,
      untrue: 1,
      unverifiable: 0,
      misleading: 0
    }

    speaker = speakers(:one)

    assert_equal(expected_stats, stats_builder.build(speaker))
  end
end
