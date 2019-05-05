# frozen_string_literal: true

require "test_helper"

class ArticleStatsBuilderTest < ActiveSupport::TestCase
  test "building source stats" do
    stats_builder = Stats::Article::StatsBuilder.new Stats::StatsCache.new Store::HashStore.new

    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    source = get_source
    speaker = get_speaker(source)
    article = get_article(source)

    assert_equal(expected_stats, stats_builder.build(article, speaker))
  end

  test "invalidate source stats" do
    store = Store::HashStore.new
    stats_builder = Stats::Article::StatsBuilder.new Stats::StatsCache.new store

    source = get_source
    speaker = get_speaker(source)
    article = get_article(source)

    stats_builder.build(article, speaker)

    stats_builder.invalidate(article)

    assert_empty store
  end

  private
    def get_source
      create(:source)
    end

    def get_speaker(source)
      speaker = create(:speaker, statement_source: source)
      source.speakers << speaker
      speaker
    end

    def get_article(source)
      segment = create(:article_segment_source_statements, source: source)

      create(:fact_check, segments: [segment])
    end
end
