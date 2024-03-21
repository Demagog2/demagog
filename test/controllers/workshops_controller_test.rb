# frozen_string_literal: true

require "test_helper"

class WorkshopsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get workshops_index_url
    assert_response :success
  end
end
