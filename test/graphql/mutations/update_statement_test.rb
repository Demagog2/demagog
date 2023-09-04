# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateStatementMutationTest < GraphQLTestCase
  def mutation(statement, source_speaker)
    "
      mutation {
        updateStatement(id: #{statement.id}, statementInput: { content: \"Lorem ipsum\", sourceSpeakerId: #{source_speaker.id} }) {
          statement {
            content
            sourceSpeaker {
              id
            }
          }
        }
      }
    "
  end

  test "should require authentication" do
    source_speaker = create(:source_speaker)
    statement = create(:statement, source_speaker:)

    result = execute_with_errors(mutation(statement, source_speaker))

    assert_auth_needed_error result
  end

  test "should update a statement" do
    source_speaker = create(:source_speaker)
    statement = create(:statement, source_speaker:)

    result = execute(mutation(statement, source_speaker), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.updateStatement.statement.content
    assert_equal source_speaker.id, result.data.updateStatement.statement.sourceSpeaker.id.to_i
  end

  test "should update statement veracity" do
    source_speaker = create(:source_speaker)
    statement = create(:statement, source_speaker:)
    veracity = create(:veracity, key: Assessment::VERACITY_MISLEADING)

    query = "
      mutation {
        updateStatement(id: #{statement.id}, statementInput: { assessment: { veracityId: #{veracity.id} } }) {
          statement {
            content
            assessment {
              id
              veracity {
                key
              }
            }
          }
        }
      }
    "

    result = execute(query, context: authenticated_user_context)

    assert_equal Assessment::VERACITY_MISLEADING, result.data.updateStatement.statement.assessment.veracity.key
    assert_equal Assessment::VERACITY_MISLEADING, Assessment.find(result.data.updateStatement.statement.assessment.id).veracity_new
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

    result = execute(mutation, variables:, context: authenticated_user_context)

    assert_equal 1, result.data.updateStatement.statement.tags.length
    assert_equal economy_tag.id.to_s, result.data.updateStatement.statement.tags[0].id
  end
end
