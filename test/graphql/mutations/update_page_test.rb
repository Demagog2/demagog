# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdatePageMutationTest < GraphQLTestCase
  def mutation(page)
    "
      mutation {
        updatePage(id: #{page.id}, pageInput: { title: \"Breaking News\" }) {
          page {
            title
          }
        }
      }
    "
  end

  test "should require authentication" do
    page = create(:page)

    result = execute_with_errors(mutation(page))

    assert_auth_needed_error result
  end

  test "should update a page" do
    page = create(:page)

    result = execute(mutation(page), context: authenticated_user_context)

    assert_equal "Breaking News", result.data.updatePage.page.title
  end
end
