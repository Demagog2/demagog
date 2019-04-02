# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteBodyMutationTest < GraphQLTestCase
  def mutation(body)
    "
      mutation {
        deleteBody(id: #{body.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    body = create(:body)

    result = execute_with_errors(mutation(body))

    assert_auth_needed_error result
  end

  test "should delete given body" do
    body = create(:body)

    result = execute(mutation(body), context: authenticated_user_context)

    assert_equal body.id.to_s, result.data.deleteBody.id
  end
end
