require 'test_helper'

class ArticleStatTest < ActiveSupport::TestCase
  test "it returns correct stats" do
    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    source = get_source
    speaker = get_speaker(source)
    article = get_article(source)

    assert_equal(expected_stats, ArticleStat.where(speaker_id: speaker.id, article_id: article.id).normalize)
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
