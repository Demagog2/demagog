# frozen_string_literal: true

require "test_helper"

class ArticleControllerTest < ActionDispatch::IntegrationTest
  test "should render fact checking" do
    article = create(:fact_check)

    get article_url(article)
    assert_response :success
  end

  test "should render static article" do
    article = create(:static)

    get article_url(article)
    assert_response :success
  end
end
