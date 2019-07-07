# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateNotificationMutationTest < GraphQLTestCase
  def mutation(notification, read_at)
    "
      mutation {
        updateNotification(id: #{notification.id}, input: { readAt: \"#{read_at}\" }) {
          notification {
            readAt
          }
        }
      }
    "
  end

  test "should require authentication" do
    user = create(:user)
    statement = create(:statement)
    notification = create(:notification, recipient: user, statement: statement)

    result = execute_with_errors(mutation(notification, Time.now))

    assert_auth_needed_error result
  end

  test "should update an notification" do
    user = create(:user)
    statement = create(:statement)
    notification = create(:notification, recipient: user, statement: statement)

    read_at = Time.now

    result = execute(mutation(notification, read_at), context: authenticated_user_context(user: user))

    assert_equal read_at.utc.iso8601, result.data.updateNotification.notification.readAt
  end
end
