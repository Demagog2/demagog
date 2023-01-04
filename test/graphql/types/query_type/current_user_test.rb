# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeCurrentUserTest < GraphQLTestCase
  test "current user should fail without auth" do
    query_string = "
      query {
        currentUser {
          id
          firstName
          lastName
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "current user should return current user with auth" do
    user = create(:user)

    query_string = "
      query {
        currentUser {
          id
          firstName
          lastName
        }
      }"

    result = execute(query_string, context: authenticated_user_context(user:))

    expected = user.full_name
    actual = "#{result.data.currentUser.firstName} #{result.data.currentUser.lastName}"

    assert_equal expected, actual
  end
end
