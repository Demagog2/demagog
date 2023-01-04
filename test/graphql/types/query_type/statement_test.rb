# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeStatementTest < GraphQLTestCase
  test "statement should return existing published statement" do
    statement = create(:statement)

    query_string = "
      query {
        statement(id: #{statement.id}) {
          id
        }
      }"

    result = execute(query_string)

    assert_equal "#{statement.id}", result.data.statement.id
  end

  test "statement should include statement video marks" do
    statement = create(:statement)
    statement.statement_video_mark = build(:statement_video_mark, statement:)
    statement.save!

    query_string = "
      query {
        statement(id: #{statement.id}) {
          id
          statementVideoMark {
            start
            stop
          }
        }
      }"

    result = execute(query_string)

    assert_equal 10, result.data.statement.statementVideoMark.start
    assert_equal 50, result.data.statement.statementVideoMark.stop
  end

  test "statement should not return existing unpublished statement" do
    statement = create(:unpublished_statement)

    query_string = "
      query {
        statement(id: #{statement.id}) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_equal "Could not find Statement with id=#{statement.id}", result.errors[0].message
  end

  test "statement should fail when trying to include unpublished without auth" do
    statement = create(:unpublished_statement)

    query_string = "
      query {
        statement(id: #{statement.id}, includeUnpublished: true) {
          id
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "statement should return unpublished statement when including unpublished and with auth" do
    statement = create(:unpublished_statement)

    query_string = "
      query {
        statement(id: #{statement.id}, includeUnpublished: true) {
          id
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal "#{statement.id}", result.data.statement.id
  end
end
