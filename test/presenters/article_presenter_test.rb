# frozen_string_literal: true

require "test_helper"

class ArticlePresenterTest < ActiveSupport::TestCase
  test "it returns correct stats" do
    source_speaker = create(:source_speaker)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment = create(:article_segment_source_statements, source:)
    article = create(:fact_check, segments: [segment])

    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    assert_equal(expected_stats, ArticlePresenter.new(article).factcheck_source_speaker_stats(source_speaker))
  end
end
