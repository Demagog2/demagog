# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateBodyMutationTestCase < GraphQLTestCase
  def mutation(body)
    "
      mutation {
        updateBody(id: #{body.id}, bodyInput: { name: \"Updated name\", isInactive: true, isParty: false}) {
          body {
            id
            name
            isInactive
            isParty
          }
        }
      }
    "
  end

  test "should required authentication" do
    body = create(:body)

    result = execute_with_errors(mutation(body))

    assert_auth_needed_error result
  end

  test "should update existing body" do
    body = create(:body)

    result = execute(mutation(body), context: authenticated_user_context)

    assert_equal "Updated name", result.data.updateBody.body.name
    assert_equal true, result.data.updateBody.body.isInactive
    assert_equal false, result.data.updateBody.body.isParty
  end
end
