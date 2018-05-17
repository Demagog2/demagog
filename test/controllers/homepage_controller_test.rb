# frozen_string_literal: true

require "test_helper"

class HomepageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    create(:party)

    get root_url
    assert_response :success
  end
end
