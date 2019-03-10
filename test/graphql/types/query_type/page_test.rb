# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypePageTest < GraphQLTestCase
  test "page should return given published page by id" do
    page = create(:page, title: "Lorem ipsum", published: true)

    query_string = "
      query {
        page(id: #{page.id}) {
          id
          title
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = page.title
    actual = result["data"]["page"]["title"]

    assert_equal expected, actual
  end

  test "page should return given published page by slug" do
    page = create(:page, title: "Lorem ipsum", published: true)

    query_string = "
      query {
        page(slug: #{page.slug}) {
          id
          title
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = page.title
    actual = result["data"]["page"]["title"]

    assert_equal expected, actual
  end

  test "page should return error if required unpublished page without auth" do
    query_string = "
      query {
        page(includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "page should return given unpublished page by id if include unpublished flag is set with auth" do
    page = create(:page, title: "Lorem ipsum", published: false)

    query_string = "
      query {
        page(id: #{page.id}, includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = page.title
    actual = result["data"]["page"]["title"]

    assert_equal expected, actual
  end

  test "page should return given unpublished page by slug if include unpublished flag is set with auth" do
    page = create(:page, title: "Lorem ipsum", published: false)

    query_string = "
      query {
        page(slug: #{page.slug}, includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = page.title
    actual = result["data"]["page"]["title"]

    assert_equal expected, actual
  end

  test "page should return error if page is deleted" do
    page = create(:page, title: "Lorem ipsum", published: true)

    # soft delete page
    page.discard

    query_string = "
      query {
        page(id: #{page.id}) {
          id
          title
        }
      }"

    result = execute_with_errors(query_string)

    assert_graphql_error("Could not find Page with id=#{page.id} or slug=", result)
  end
end
