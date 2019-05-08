# frozen_string_literal: true

require "test_helper"

class ArticleControllerTest < ActionDispatch::IntegrationTest
  test "should render fact checking" do
    speaker = create(:speaker)
    source = create(:source, speakers: [speaker], statements: [create(:statement, speaker: speaker), create(:statement, speaker: speaker)])
    segment = create(:article_segment_source_statements, source: source)
    article = create(:fact_check, segments: [segment])

    get article_url(article)
    assert_response :success
  end

  test "should render static article" do
    article = create(:static)

    get article_url(article)
    assert_response :success
  end
end
