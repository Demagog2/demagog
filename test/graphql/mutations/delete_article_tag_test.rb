# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteArticleTagMutationTest < GraphQLTestCase
  def mutation(article_tag)
    "
      mutation {
        deleteArticleTag(id: #{article_tag.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    article_tag = create(:article_tag)

    result = execute_with_errors(mutation(article_tag))

    assert_auth_needed_error result
  end

  test "should delete an article tag" do
    article_tag = create(:article_tag)

    result = execute(mutation(article_tag), context: authenticated_user_context)

    assert result.data.deleteArticleTag, article_tag.id

    assert_raise(Exception) { ArticleTag.find(article_tag.id) }
  end

  test "should return an error if deleting missing article tag" do
    article_tag = create(:article_tag)
    article_tag.destroy

    result = execute_with_errors(mutation(article_tag), context: authenticated_user_context)

    assert_equal "Couldn't find ArticleTag with 'id'=#{article_tag.id}", result.errors.last.message
  end
end
