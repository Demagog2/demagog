# frozen_string_literal: true

require "test_helper"

class SpeakerStatsBuilderTest < ActiveSupport::TestCase
  setup do
    ensure_veracities
  end

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

  test "invalidate speaker stats" do
    store = Store::HashStore.new

    stats_builder = Stats::Speaker::StatsBuilder.new Stats::StatsCache.new store

    speaker = create(:speaker)

    stats_builder.build(speaker)

    stats_builder.invalidate(speaker)

    assert_empty store
  end
end
