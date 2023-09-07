# frozen_string_literal: true

require "test_helper"

class ArticleTagTest < ActiveSupport::TestCase
  test "deletes article tag" do
    article_tag = create(:article_tag)

    assert_changes -> { ArticleTag.count }, from: 1, to: 0 do
      ArticleTag.destroy(article_tag.id)
    end
  end

  test "throws exception if article doesn't exist" do
    assert_raises(ActiveRecord::RecordNotFound) do
      ArticleTag.destroy(12345)
    end
  end
end
