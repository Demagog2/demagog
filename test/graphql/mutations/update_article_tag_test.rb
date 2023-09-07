# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateArticleTagTest < GraphQLTestCase
  def mutation(article_tag)
    "
      mutation {
        updateArticleTag(id: #{article_tag.id}, articleTagInput: { slug: \"hello-world\", title: \"Hello, World\" }) {
          articleTag {
            title
          }
        }
      }
    "
  end

  test "should require authentication" do
    article_tag = create(:article_tag)

    result = execute_with_errors(mutation(article_tag))

    assert_auth_needed_error result
  end

  test "should update an article tag" do
    article_tag = create(:article_tag)

    result = execute(mutation(article_tag), context: authenticated_user_context)

    assert_equal "Hello, World", result.data.updateArticleTag.articleTag.title
  end
end
