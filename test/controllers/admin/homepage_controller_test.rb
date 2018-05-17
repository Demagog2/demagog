# frozen_string_literal: true

require "test_helper"

class Admin::HomepageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_url
    assert_response :success
  end
end
