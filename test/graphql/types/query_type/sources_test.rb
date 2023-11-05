# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSourcesTest < GraphQLTestCase
  test "sources should not return ones without published statements" do
    source = create(:source)
    speaker = create(:speaker, statement_count: 0)
    source_speaker = create(:source_speaker, source:, speaker:)
    create_list(:statement, 10, source:, source_speaker:, published: false)

    query_string = "
      query {
        sources {
          id
        }
      }"

    result = execute(query_string)

    assert_equal 0, result.data.sources.size
  end

  test "sources including the ones without published statements should not be accessible to unauthenticated" do
    source = create(:source)
    speaker = create(:speaker, statement_count: 0)
    source_speaker = create(:source_speaker, source:, speaker:)
    create_list(:statement, 10, source:, source_speaker:, published: true)

    query_string = "
      query {
        sources(includeOnesWithoutPublishedStatements: true) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "sources including the ones without published statements should be accessible to authenticated" do
    source = create(:source)
    speaker = create(:speaker, statement_count: 0)
    source_speaker = create(:source_speaker, source:, speaker:)
    create_list(:statement, 10, source:, source_speaker:, published: true)

    query_string = "
      query {
        sources(includeOnesWithoutPublishedStatements: true) {
          id
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal 1, result.data.sources.size
  end

  test "sources should not be searchable by name by unauthenticated" do
    source = create(:source, name: "Test source")
    speaker = create(:speaker, statement_count: 0)
    source_speaker = create(:source_speaker, source:, speaker:)
    create_list(:statement, 10, source:, source_speaker:, published: true)

    query_string = "
      query {
        sources(name: \"Test\") {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "sources should be searchable by name by authenticated" do
    source = create(:source, name: "Test source")
    speaker = create(:speaker, statement_count: 0)
    source_speaker = create(:source_speaker, source:, speaker:)
    create_list(:statement, 10, source:, source_speaker:, published: true)

    query_string = "
      query {
        sources(name: \"Test\") {
          id
          name
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal 1, result.data.sources.size
    assert_equal "Test source", result.data.sources.first.name
  end
end
