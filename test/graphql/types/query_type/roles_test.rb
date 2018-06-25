# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeRolesTest < GraphQLTestCase
  test "roles should fail without auth" do
    query_string = "
      query {
        roles {
          id
          key
          name
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "roles should return list of roles with auth" do
    query_string = "
      query {
        roles {
          id
          key
          name
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = ["admin", "expert", "social_media_manager", "proofreader", "intern"]
    actual = result["data"]["roles"].map { |r| r["key"] }

    assert_equal expected, actual
  end
end
