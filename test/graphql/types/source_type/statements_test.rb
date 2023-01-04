# frozen_string_literal: true

require "graphql/graphql_testcase"

class SourceTypeStatementsTest < GraphQLTestCase
  test "source statements should return some statements" do
    source = create(:source)
    create_list(:statement, 10, source:)

    query_string = "
      query {
        source(id: #{source.id}) {
          statements {
            id
          }
        }
      }"

    result = execute(query_string)

    assert result.data.source.statements.size > 0
  end

  test "source statements should return only published without any args" do
    source = create(:source)
    create_list(:unpublished_statement, 1, source:)

    query_string = "
      query {
        source(id: #{source.id}) {
          statements {
            id
            published
          }
        }
      }"

    result = execute(query_string)

    assert result.data.source.statements.all? { |s| s.published }
  end

  test "source statements return error when trying to get unpublished without auth" do
    source = create(:source)
    create_list(:unpublished_statement, 1, source:)

    query_string = "
      query {
        source(id: #{source.id}) {
          statements(includeUnpublished: true) {
            id
            published
          }
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "source statements should return also unpublished with auth" do
    source = create(:source)
    create_list(:unpublished_statement, 1, source:)

    query_string = "
      query {
        source(id: #{source.id}) {
          statements(includeUnpublished: true) {
            id
            published
          }
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert result.data.source.statements.any? { |s| !s.published }
  end
end
