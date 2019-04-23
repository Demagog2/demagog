# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeletePageMutationTest < GraphQLTestCase
  def mutation(page)
    "
      mutation {
        deletePage(id: #{page.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    page = create(:page)

    result = execute_with_errors(mutation(page))

    assert_auth_needed_error result
  end

  test "should delete a page" do
    page = create(:page)

    result = execute(mutation(page), context: authenticated_user_context)

    assert result.data.deletePage, page.id

    assert_raise(Exception) do
      Page.find(page.id)
    end
  end
end
