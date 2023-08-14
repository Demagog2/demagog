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

  test "does not show factcheck video for static article" do
    article = build(:static)

    assert_not ArticlePresenter.new(article).show_factcheck_video
  end

  test "it shows factcheck video for factcheck with source with video attached" do
    segment = create(:article_segment_source_statements, source: create(:source, :with_video))
    article = create(:article, segments: [segment])

    assert ArticlePresenter.new(article).show_factcheck_video
  end
end
