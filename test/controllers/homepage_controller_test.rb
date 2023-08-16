# frozen_string_literal: true

require "test_helper"

class HomepageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    source_speaker = create(:source_speaker)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment = create(:article_segment_source_statements, source:)
    create(:fact_check, segments: [segment])

    article = create(:article, :single_stamement)
    create(:article_segment_single_statement, article:)

    get root_url
    assert_response :success
  end

  test "deleted articles should not be present on the homepage" do
    source_speaker = create(:source_speaker)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment_one = create(:article_segment_source_statements, source:)
    segment_two = create(:article_segment_source_statements, source:)
    segment_three = create(:article_segment_source_statements, source:)

    article_one = create(:fact_check, title: "Article one", segments: [segment_one], published: true)
    article_two = create(:fact_check, title: "Article two", segments: [segment_two], published: true)
    article_three = create(:fact_check, title: "Article three", segments: [segment_three], published: true)

    article_three.discard!

    get root_url
    assert_response :success
    assert_select ".s-article .s-title", text: article_one.title, count: 1
    assert_select ".s-article .s-title", text: article_two.title, count: 1
    # Not listed cause it's deleted
    assert_select ".s-article .s-title", text: article_three.title, count: 0
  end
end
