# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeNotificationsTest < GraphQLTestCase
  test "notifications should return error for unauth user" do
    query_string = "
      query {
        notifications {
          totalCount
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "notifications should return total count and notifications for auth user" do
    user = create(:user)
    statement = create(:statement)
    create_list(:notification, 2, recipient: user, statement:)

    query_string = "
      query {
        notifications {
          totalCount
        }
      }"

    result = execute(query_string, context: authenticated_user_context(user:))

    assert_equal 2, result.data.notifications.totalCount
  end

  test "notifications should return also read ones if include_read flag is sent" do
    user = create(:user)
    statement = create(:statement)
    create_list(:notification, 2, recipient: user, statement:)
    create(:notification, recipient: user, statement:, read_at: Time.now)

    query_string = "
       query {
         notifications(includeRead: true) {
           totalCount
         }
       }"

    result = execute(query_string, context: authenticated_user_context(user:))

    assert_equal 3, result.data.notifications.totalCount
  end
end
