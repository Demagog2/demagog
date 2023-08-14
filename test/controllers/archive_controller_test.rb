# frozen_string_literal: true

require "test_helper"

class ArchiveControllerTest < ActionDispatch::IntegrationTest
  test "should render empty index page" do
    get archive_url
    assert_response :success
  end

  test "should render index page with articles" do
    create_list(:article, 2)
    create_list(:static, 2)

    get archive_url
    assert_response :success
  end
end
