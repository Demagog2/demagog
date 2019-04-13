# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateStatementMutationTest < GraphQLTestCase
  def mutation(statement)
    "
      mutation {
        updateStatement(id: #{statement.id}, statementInput: { content: \"Lorem ipsum\" }) {
          statement {
            content
          }
        }
      }
    "
  end

  test "should require authentication" do
    statement = create(:statement)

    result = execute_with_errors(mutation(statement))

    assert_auth_needed_error result
  end

  test "should update a statement" do
    statement = create(:statement)

    result = execute(mutation(statement), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.updateStatement.statement.content
  end
end
