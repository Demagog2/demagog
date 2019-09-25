# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateUserMutationTest < GraphQLTestCase
  def mutation(user)
    "
      mutation {
        updateUser(id: #{user.id}, userInput: { firstName: \"Jim\", lastName: \"Boe\", email: \"john.doe@example.com\", roleId: #{user.role.id}, emailNotifications: false }) {
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
    user = create(:user, :admin)

    result = execute_with_errors(mutation(user))

    assert_auth_needed_error result
  end

  test "should create a user" do
    user = create(:user, :admin)

    result = execute(mutation(user), context: authenticated_user_context)

    assert_equal "Jim", result.data.updateUser.user.firstName
    assert_equal "Boe", result.data.updateUser.user.lastName
  end
end
