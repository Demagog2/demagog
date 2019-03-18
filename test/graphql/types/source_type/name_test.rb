# frozen_string_literal: true

require "graphql/graphql_testcase"

class SourceTypeNameTest < GraphQLTestCase
  test "Unauthenticated should not be able to access name" do
    source = create(:source, name: "Test source")

    query_string = "
      query {
        source(id: #{source.id}) {
          name
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "Authenticated should be able to access name" do
    source = create(:source, name: "Test source")

    query_string = "
      query {
        source(id: #{source.id}) {
          name
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal "Test source", result["data"]["source"]["name"]
  end
end
