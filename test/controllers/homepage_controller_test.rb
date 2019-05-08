# frozen_string_literal: true

require "test_helper"

class HomepageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    speaker = create(:speaker)
    source = create(:source, speakers: [speaker], statements: [create(:statement, speaker: speaker), create(:statement, speaker: speaker)])
    segment = create(:article_segment_source_statements, source: source)
    create(:fact_check, segments: [segment])

    get root_url
    assert_response :success
  end
end
