# frozen_string_literal: true

require "test_helper"

class RedirectControllerTest < ActionDispatch::IntegrationTest
  test "should redirect discussion" do
    discussion = create(:fact_check)
    get redirect_discussion_url(id: discussion.id, slug: discussion.slug)
    assert_redirected_to article_url(discussion)
  end

  test "should not redirect to deleted discussion" do
    discussion = create(:fact_check)
    discussion.discard!
    assert_raises(ActionController::RoutingError) do
      get redirect_discussion_url(id: discussion.id, slug: discussion.slug)
    end
  end

  test "should redirect static page" do
    discussion = create(:static)
    get redirect_static_url(id: discussion.id, slug: discussion.slug)
    assert_redirected_to article_url(discussion)
  end
end
