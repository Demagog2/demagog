# frozen_string_literal: true

require "test_helper"

class ArticleControllerTest < ActionDispatch::IntegrationTest
  def create_article
    source_speaker = create(:source_speaker)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment = create(:article_segment_source_statements, source:)
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

  test "should redirect when recnik query param uses id only" do
    speaker = create(:speaker)
    source_speaker = create(:source_speaker, speaker:)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment = create(:article_segment_source_statements, source:)
    article = create(:fact_check, segments: [segment])

    get article_url(article, recnik: speaker.id)
    assert_redirected_to article_url(article, recnik: "#{speaker.full_name.parameterize}-#{speaker.id}")
  end
end
