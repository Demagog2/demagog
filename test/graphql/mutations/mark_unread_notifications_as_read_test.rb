# frozen_string_literal: true

require "graphql/graphql_testcase"

class MarkUnreadNotificationsAsReadMutationTest < GraphQLTestCase
  def mutation
    "
      mutation {
        markUnreadNotificationsAsRead {
          notifications {
            readAt
          }
        }
      }
    "
  end

  test "should require authentication" do
    user = create(:user)
    statement = create(:statement)
    create_list(:notification, 3, :unread, recipient: user, statement: statement)

    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should update mark all unread notifications as read" do
    user = create(:user)
    statement = create(:statement)
    create_list(:notification, 3, :unread, recipient: user, statement: statement)

    result = execute(mutation, context: authenticated_user_context(user: user))

    assert_equal true, result.data.markUnreadNotificationsAsRead.notifications.all?(&:readAt)
  end
end
