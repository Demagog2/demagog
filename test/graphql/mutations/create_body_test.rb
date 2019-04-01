# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateBodyMutationTestCase < GraphQLTestCase
  def mutation
    "
      mutation {
        createBody(bodyInput: { name: \"My new party\", isInactive: false, isParty: true}) {
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
    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should create a body" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "My new party", result.data.createBody.body.name
    assert_equal false, result.data.createBody.body.isInactive
    assert_equal true, result.data.createBody.body.isParty
  end
end
