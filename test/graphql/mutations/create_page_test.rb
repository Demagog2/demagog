# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreatePageMutationTest < GraphQLTestCase
  def mutation
    "
      mutation {
        createPage(pageInput: { title: \"Breaking News\" }) {
          page {
            title
          }
        }
      }
    "
  end

  test "should require authentication" do
    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should create a page" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "Breaking News", result.data.createPage.page.title
  end
end
