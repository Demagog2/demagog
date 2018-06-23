# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeStatementsTest < GraphQLTestCase
  test "statements should return some statements" do
    create_list(:statement, 10)

    query_string = "
      query {
        statements {
          id
        }
      }"

    result = execute(query_string)

    assert_equal 10, result["data"]["statements"].size
  end

  test "statements should return only published without any args" do
    create_list(:statement, 10)

    query_string = "
      query {
        statements {
          id
          published
        }
      }"

    result = execute(query_string)

    assert result["data"]["statements"].all? { |s| s["published"] }
  end

  test "statements return error when trying to get unpublished without auth" do
    create_list(:unpublished_statement, 10)

    query_string = "
      query {
        statements(include_unpublished: true) {
          id
          published
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "statements should return also unpublished with auth" do
    create_list(:unpublished_statement, 10)

    query_string = "
      query {
        statements(include_unpublished: true) {
          id
          published
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert result["data"]["statements"].any? { |s| !s["published"] }
  end
end
