# frozen_string_literal: true

require "test_helper"

class SourceStatsBuilderTest < ActiveSupport::TestCase
  test "building source stats" do
    stats_builder = Stats::Source::StatsBuilder.new Stats::StatsCache.new Store::HashStore.new

    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    source = create(:source)

    speaker = create(:speaker, statement_source: source)

    assert_equal(expected_stats, stats_builder.build(source, speaker))
  end
end
