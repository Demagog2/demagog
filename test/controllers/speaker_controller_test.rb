# frozen_string_literal: true

require "test_helper"

class SpeakerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get speakers_url()
    assert_response :success
  end

  test "should get index with party id" do
    get speakers_url(groups(:group_a))
    assert_response :success
  end

  test "should get show" do
    get speaker_url(speakers(:one))
    assert_response :success
  end
end
