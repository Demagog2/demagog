# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteUserMutationTestCase < GraphQLTestCase
  test "source statements should return some statements" do
    user = create(:user)

    query_string = "
      mutation {
        deleteUser(id: #{user.id})
      }
    "

    result = execute(query_string, context: authenticated_user_context)

    assert result["data"]["deleteUser"], user.id

    assert_raise(Exception) do
      User.find(user.id)
    end
  end
end
