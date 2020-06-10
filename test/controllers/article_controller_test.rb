# frozen_string_literal: true

require "test_helper"

class ArticleControllerTest < ActionDispatch::IntegrationTest
  def create_article
    speaker = create(:speaker)
    source =
      create(
        :source,
        speakers: [speaker],
        statements: [create(:statement, speaker: speaker), create(:statement, speaker: speaker)]
      )
    segment = create(:article_segment_source_statements, source: source)
    create(:fact_check, segments: [segment])
  end

  test "should render fact checking" do
    article = create_article
    get article_url(article)
    assert_response :success
  end

  test "should fail on deleted article" do
    article = create_article
    article.discard!

    assert_raises(ActiveRecord::RecordNotFound) { get article_url(article) }
  end

  test "should render static article" do
    article = create(:static)

    get article_url(article)
    assert_response :success
  end
end
