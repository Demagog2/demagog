# frozen_string_literal: true

require "test_helper"

class RedirectControllerTest < ActionDispatch::IntegrationTest
  test "should redirect discussion" do
    discussion = articles(:one)
    get redirect_discussion_url(id: discussion.id, slug: discussion.slug)
    assert_redirected_to article_url(discussion)
  end

  test "should redirect static page" do
    discussion = articles(:two)
    get redirect_static_url(id: discussion.id, slug: discussion.slug)
    assert_redirected_to article_url(discussion)
  end
end
