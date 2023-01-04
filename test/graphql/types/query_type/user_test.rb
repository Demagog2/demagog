# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeUserTest < GraphQLTestCase
  test "user should fail without auth" do
    query_string = "
      query {
        user(id: 1) {
          id
          firstName
          lastName
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "user should return given user with auth" do
    user = create(:user)

    query_string = "
      query {
        user(id: #{user.id}) {
          id
          firstName
          lastName
        }
      }"

    result = execute(query_string, context: authenticated_user_context(user:))

    expected = user.full_name
    actual = "#{result.data.user.firstName} #{result.data.user.lastName}"

    assert_equal expected, actual
  end

  test "user should return error if user does not exist (or is deleted)" do
    user = create(:user)

    # soft delete user
    user.discard

    query_string = "
      query {
        user(id: #{user.id}) {
          id
          firstName
          lastName
        }
      }"

    result = execute_with_errors(query_string, context: authenticated_user_context(user:))

    assert_graphql_error("Could not find User with id=#{user.id}", result)
  end
end
