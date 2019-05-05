# frozen_string_literal: true

require "test_helper"

class SpeakerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    create(:party)

    get speakers_url()
    assert_response :success
  end

  test "should get index with party id" do
    party = create(:party)

    get speakers_url(party)
    assert_response :success
  end

  test "should get show" do
    speaker = create(:speaker_with_party)

    get speaker_url(speaker)
    assert_response :success

    assert_select ".s-speaker-name .s-body"
  end

  test "should handle showing speaker without party" do
    speaker = create(:speaker)

    get speaker_url(speaker)
    assert_response :success

    assert_select ".s-speaker-name .s-body", 0
  end
end
