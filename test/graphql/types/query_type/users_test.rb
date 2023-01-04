# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeUsersTest < GraphQLTestCase
  test "users should fail without auth" do
    query_string = "
      query {
        users {
          id
          firstName
          lastName
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "roles should return list of users with auth" do
    user = create(:user)

    query_string = "
      query {
        users {
          id
          firstName
          lastName
        }
      }"

    result = execute(query_string, context: authenticated_user_context(user:))

    expected = [user.full_name]
    actual = result.data.users.map { |r| "#{r.firstName} #{r.lastName}" }

    assert_equal expected, actual
  end

  test "users should return list of inactive users if include inactive flag is set" do
    active_user = create(:user, active: true)
    inactive_user = create(:user, first_name: "Jane", active: false)

    query_string = "
      query {
        users(includeInactive: true) {
          id
          firstName
          lastName
        }
      }"

    result = execute(query_string, context: authenticated_user_context(user: active_user))

    expected = [inactive_user.full_name, active_user.full_name]
    actual = result.data.users.map { |r| "#{r.firstName} #{r.lastName}" }

    assert_equal expected, actual
  end

  test "users should return list of users with given role" do
    admin_user = create(:user, :admin, first_name: "John")
    expert_user = create(:user, :expert, first_name: "Jane")
    create(:user, :proofreader, first_name: "Jim")

    query_string = '
      query {
        users(roles: ["admin", "expert"]) {
          id
          firstName
          lastName
        }
      }'

    result = execute(query_string, context: authenticated_user_context(user: admin_user))

    expected = [expert_user.full_name, admin_user.full_name]
    actual = result.data.users.map { |r| "#{r.firstName} #{r.lastName}" }

    assert_equal expected, actual
  end

  test "users should return list of users matching name" do
    user = create(:user, first_name: "John")
    create(:user, first_name: "Jane")
    create(:user, first_name: "Jim")

    query_string = '
      query {
        users(name: "John") {
          id
          firstName
          lastName
        }
      }'

    result = execute(query_string, context: authenticated_user_context(user:))

    expected = [user.full_name]
    actual = result.data.users.map { |r| "#{r.firstName} #{r.lastName}" }

    assert_equal expected, actual
  end

  test "users should return list of users with respect to limit and offset" do
    create(:user, first_name: "User 1")
    create(:user, first_name: "User 2")
    user = create(:user, first_name: "User 3")

    query_string = '
      query {
        users(offset: 2, limit: 1) {
          id
          firstName
          lastName
        }
      }'

    result = execute(query_string, context: authenticated_user_context(user:))

    expected = [user.full_name]
    actual = result.data.users.map { |r| "#{r.firstName} #{r.lastName}" }

    assert_equal expected, actual
  end
end
