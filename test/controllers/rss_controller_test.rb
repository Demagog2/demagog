# frozen_string_literal: true

require "test_helper"

class RssControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get rss_index_url(format: :atom)
    assert_response :success
  end
end
