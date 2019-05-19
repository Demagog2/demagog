# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateStatementMutationTest < GraphQLTestCase
  def mutation(statement, speaker)
    "
      mutation {
        updateStatement(id: #{statement.id}, statementInput: { content: \"Lorem ipsum\", speaker: #{speaker.id} }) {
          statement {
            content
            speaker {
              id
            }
          }
        }
      }
    "
  end

  test "should require authentication" do
    statement = create(:statement)
    speaker = create(:speaker)

    result = execute_with_errors(mutation(statement, speaker))

    assert_auth_needed_error result
  end

  test "should update a statement" do
    statement = create(:statement)
    speaker = create(:speaker)

    result = execute(mutation(statement, speaker), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.updateStatement.statement.content
    assert_equal speaker.id, result.data.updateStatement.statement.speaker.id.to_i
  end

  test "should update statement tags" do
    economy_tag = Tag.find_or_create_by!(name: "Hospodářství", for_statement_type: Statement::TYPE_PROMISE)
    statement = create(:statement, :promise_statement)

    mutation = "
      mutation UpdateStatement($id: Int!, $statementInput: UpdateStatementInput!) {
        updateStatement(id: $id, statementInput: $statementInput) {
          statement {
            content
            tags {
              id
            }
          }
        }
      }
    "
    variables = {
      "id" => statement.id,
      "statementInput" => {
        "tags" => [economy_tag.id]
      }
    }

    result = execute(mutation, variables: variables, context: authenticated_user_context)

    assert_equal 1, result.data.updateStatement.statement.tags.length
    assert_equal economy_tag.id.to_s, result.data.updateStatement.statement.tags[0].id
  end
end
