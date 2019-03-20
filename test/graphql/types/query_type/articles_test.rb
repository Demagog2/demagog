# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeArticlesTest < GraphQLTestCase
  test "articles should return published articles by default" do
    create_list(:fact_check, 5, published: true)

    query_string = "
      query {
        articles {
          id
        }
      }"

    result = execute(query_string)

    assert_equal 5, result.data.articles.size
  end

  test "articles should return only published without any args" do
    create_list(:fact_check, 5, published: false)

    query_string = "
      query {
        articles(includeUnpublished: true) {
          id
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal 5, result.data.articles.size
  end

  test "articles return error when trying to get unpublished without auth" do
    create_list(:fact_check, 10)

    query_string = "
      query {
        articles(includeUnpublished: true) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "articles return articles matching title" do
    create(:fact_check, title: "Lorem ipsum", published: true)
    create(:fact_check, title: "Sit amet", published: true)

    query_string = "
      query {
        articles(title: \"Lorem\") {
          id
          title
        }
      }"

    result = execute(query_string)
    expected = ["Lorem ipsum"]

    assert_equal expected, result.data.articles.map { |p| p.title }
  end
end
