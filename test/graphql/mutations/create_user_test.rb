# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateUserMutationTest < GraphQLTestCase
  def mutation
    role = create(:role)

    "
      mutation {
        createUser(userInput: { firstName: \"John\", lastName: \"Doe\", email: \"john.doe@example.com\", active: true, roleId: #{role.id}, emailNotifications: false }) {
          user {
            id
            firstName
            lastName
          }
        }
      }
    "
  end

  test "should require authentication" do
    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should create a user" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "John", result.data.createUser.user.firstName
    assert_equal "Doe", result.data.createUser.user.lastName
  end
end
