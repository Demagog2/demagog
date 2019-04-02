# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteUserMutationTest < GraphQLTestCase
  def mutation(user)
    "
      mutation {
        deleteUser(id: #{user.id})
      }
    "
  end

  test "should require authentication" do
    user = create(:user)

    result = execute_with_errors(mutation(user))

    assert_auth_needed_error result
  end

  test "should delete a user" do
    user = create(:user)

    result = execute(mutation(user), context: authenticated_user_context)

    assert result.data.deleteUser, user.id

    assert_raise(Exception) do
      User.find(user.id)
    end
  end
end
