# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateUserActivenessMutationTest < GraphQLTestCase
  def mutation(user:, user_active:)
    "
      mutation {
        updateUserActiveness(id: #{user.id}, userActive: #{user_active}) {
          user {
            id
            active
          }
        }
      }
    "
  end

  test "should required authentication" do
    user = create(:user)

    result = execute_with_errors(mutation(user:, user_active: true))

    assert_auth_needed_error result
  end

  test "should update activeness" do
    user = create(:user, active: false)

    result = execute(mutation(user:, user_active: true), context: authenticated_user_context)

    assert_equal true, result.data.updateUserActiveness.user.active
  end
end
