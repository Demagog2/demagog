# frozen_string_literal: true

require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  setup do
    @article_type = create(:article_type, name: "default")
    @source = create(:source)
    @statements = create_list(:statement, 3, source: @source)
  end

  test "soft delete" do
    assert_discardable create(:static)
  end

  test "create article" do
    article_input = {
      title: "My article",
      perex: "Lorem ipsum sit dolor del amet...",
      article_type: "default",
      segments: [
        {
          segment_type: "text",
          text_html: "<p>Lorem ipsum...</p>"
        },
        {
          segment_type: "source_statements",
          source_id: @source.id
        }
      ]
    }

    assert_changes -> { Article.count }, "Expected article to be created" do
      article = Article.create_article article_input

      assert_equal 2, article.segments.size

      segment = article.segments.first
      assert_equal "text", segment.segment_type
      assert_equal "<p>Lorem ipsum...</p>", segment.text_html

      segment = article.segments.second
      assert_equal "source_statements", segment.segment_type
      assert_equal @source.id, segment.source.id
      assert_equal @statements.size, segment.all_published_statements.size
    end
  end

  test "update article" do
    original_article = create(:article, article_type: @article_type)

    article_input = {
      title: "My article",
      perex: "Lorem ipsum sit dolor del amet...",
      article_type: "default",
      segments: [
        {
          segment_type: "text",
          text_html: "<p>Lorem ipsum...</p>"
        },
        {
          segment_type: "source_statements",
          source_id: @source.id
        }
      ]
    }

    assert_changes -> { Article.find(original_article.id).title }, "Expected article to be updated" do
      article = Article.update_article original_article.id, article_input

      assert_equal 2, article.segments.size

      segment = article.segments.first
      assert_equal "text", segment.segment_type
      assert_equal "<p>Lorem ipsum...</p>", segment.text_html

      segment = article.segments.second
      assert_equal "source_statements", segment.segment_type
      assert_equal @source.id, segment.source.id
      assert_equal @statements.size, segment.all_published_statements.size
    end
  end
end
