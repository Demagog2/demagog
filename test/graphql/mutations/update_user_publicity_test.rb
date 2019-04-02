# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateUserPublicityMutationTest < GraphQLTestCase
  def mutation(user:, user_public:)
    "
      mutation {
        updateUserPublicity(id: #{user.id}, userPublic: #{user_public}) {
          user {
            id
            userPublic
          }
        }
      }
    "
  end

  test "should required authentication" do
    user = create(:user)

    result = execute_with_errors(mutation(user: user, user_public: true))

    assert_auth_needed_error result
  end

  test "should update publicity" do
    user = create(:user, user_public: false)

    result = execute(mutation(user: user, user_public: true), context: authenticated_user_context)

    assert_equal true, result.data.updateUserPublicity.user.userPublic
  end
end
