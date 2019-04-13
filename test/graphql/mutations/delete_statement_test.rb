# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteStatementMutationTest < GraphQLTestCase
  def mutation(statement)
    "
      mutation {
        deleteStatement(id: #{statement.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    statement = create(:statement)

    result = execute_with_errors(mutation(statement))

    assert_auth_needed_error result
  end

  test "should delete given statement" do
    statement = create(:statement)

    result = execute(mutation(statement), context: authenticated_user_context)

    assert_equal statement.id.to_s, result.data.deleteStatement.id
  end
end
