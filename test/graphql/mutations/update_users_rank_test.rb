# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateUsersRankMutationTest < GraphQLTestCase
  def mutation(users)
    "
      mutation {
        updateUsersRank(orderedUserIds: [#{users.map(&:id).join(', ')}]) {
          users {
            id
          }
        }
      }
    "
  end

  test "should required authentication" do
    users = create_list(:user, 3)

    result = execute_with_errors(mutation(users))

    assert_auth_needed_error result
  end

  test "should update publicity" do
    users = create_list(:user, 3, :admin)

    result = execute(mutation(users.reverse), context: authenticated_user_context(user: users.first))

    assert_equal users.reverse.map(&:id).map(&:to_s), result.data.updateUsersRank.users.map(&:id)
  end
end
