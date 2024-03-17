# frozen_string_literal: true

require "test_helper"

class CampaignControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get campaign_index_url
    assert_response :success
  end
end
