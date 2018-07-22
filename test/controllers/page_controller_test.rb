# frozen_string_literal: true

require "test_helper"

class PageControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    page = create(:page, published: true)

    get page_url(slug: page.slug)
    assert_response :success
  end
end
