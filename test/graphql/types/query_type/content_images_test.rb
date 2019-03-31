# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeContentImagesTest < GraphQLTestCase
  test "content images should return error for unauth user" do
    query_string = "
      query {
        contentImages {
          totalCount
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "content images should return total count and content images" do
    first = create(:content_image)
    second = create(:content_image)

    query_string = "
      query {
        contentImages {
          totalCount
          items {
            id
          }
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal 2, result.data.contentImages.totalCount
    assert_equal [second.id.to_s, first.id.to_s], result.data.contentImages.items.map(&:id)
  end

=begin
  test "notifications should return also read ones if include_read flag is sent" do
    user = create(:user)
    create_list(:notification, 2, recipient: user)
    create(:notification, recipient: user, read_at: Time.now)

    query_string = "
       query {
         notifications(includeRead: true) {
           totalCount
         }
       }"

    result = execute(query_string, context: authenticated_user_context(user: user))

    assert_equal 3, result.data.notifications.totalCount
  end
=end
end
