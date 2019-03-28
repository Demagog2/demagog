# frozen_string_literal: true

require "graphql/graphql_testcase"

class SourceTypeTranscriptTest < GraphQLTestCase
  test "Unauthenticated should not be able to access transcript" do
    source = create(:source, transcript: "Lorem ipsum")

    query_string = "
      query {
        source(id: #{source.id}) {
          transcript
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "Authenticated should be able to access transcript" do
    source = create(:source, transcript: "Lorem ipsum")

    query_string = "
      query {
        source(id: #{source.id}) {
          transcript
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal "Lorem ipsum", result["data"]["source"]["transcript"]
  end
end
