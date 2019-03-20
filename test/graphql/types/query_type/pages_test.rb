# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypePagesTest < GraphQLTestCase
  test "pages should return published pages by default" do
    create_list(:page, 5, published: true)

    query_string = "
      query {
        pages {
          id
        }
      }"

    result = execute(query_string)

    assert_equal 5, result.data.pages.size
  end

  test "pages should return only published without any args" do
    create_list(:page, 5, published: false)

    query_string = "
      query {
        pages(includeUnpublished: true) {
          id
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal 5, result.data.pages.size
  end

  test "pages return error when trying to get unpublished without auth" do
    create_list(:page, 10)

    query_string = "
      query {
        pages(includeUnpublished: true) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "pages return pages matching title" do
    create(:page, title: "Lorem ipsum", published: true)
    create(:page, title: "Sit amet", published: true)

    query_string = "
      query {
        pages(title: \"Lorem\") {
          id
          title
        }
      }"

    result = execute(query_string)
    expected = ["Lorem ipsum"]

    assert_equal expected, result.data.pages.map { |p| p.title }
  end
end
