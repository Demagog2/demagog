# frozen_string_literal: true

require "test_helper"

class SpeakerStatsBuilderTest < ActiveSupport::TestCase
  test "building speaker stats" do
    stats_builder = Stats::Speaker::StatsBuilder.new Stats::StatsCache.new Store::HashStore.new

    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    speaker = create(:speaker)

    assert_equal(expected_stats, stats_builder.build(speaker))
  end
end
