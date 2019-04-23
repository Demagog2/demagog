# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteArticleMutationTest < GraphQLTestCase
  def mutation(article)
    "
      mutation {
        deleteArticle(id: #{article.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    article = create(:fact_check)

    result = execute_with_errors(mutation(article))

    assert_auth_needed_error result
  end

  test "should delete a article" do
    article = create(:fact_check)

    result = execute(mutation(article), context: authenticated_user_context)

    assert result.data.deleteArticle, article.id

    assert_raise(Exception) do
      Article.find(article.id)
    end
  end
end
