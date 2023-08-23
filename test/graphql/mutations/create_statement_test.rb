# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateStatementMutationTest < GraphQLTestCase
  def mutation(statement_type, source_speaker, source, evaluator)
    "
      mutation {
        createStatement(statementInput: { statementType: #{statement_type}, content: \"Lorem ipsum\", excerptedAt: \"2018-01-01\", important: false, sourceSpeakerId: #{source_speaker.id}, sourceId: #{source.id}, published: false, assessment: { evaluatorId: #{evaluator.id}  } }) {
          statement {
            content
            assessment {
              veracity {
                key
              }
            }
          }
        }
      }
    "
  end

  test "should require authentication" do
    source_speaker = create(:source_speaker)
    source = create(:source, source_speakers: [source_speaker])
    evaluator = create(:user)

    result = execute_with_errors(mutation("factual", source_speaker, source, evaluator))

    assert_auth_needed_error result
  end

  test "should create factual statement" do
    source_speaker = create(:source_speaker)
    source = create(:source, source_speakers: [source_speaker])
    evaluator = create(:user)

    result = execute(mutation("factual", source_speaker, source, evaluator), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.createStatement.statement.content
  end

  test "should create factual statement with assessment" do
    source_speaker = create(:source_speaker)
    source = create(:source, source_speakers: [source_speaker])
    evaluator = create(:user)
    veracity = create(:veracity, key: Assessment::VERACITY_UNTRUE)

    query = "
      mutation {
        createStatement(statementInput: { statementType: factual, content: \"Lorem ipsum\", excerptedAt: \"2018-01-01\", important: false, sourceSpeakerId: #{source_speaker.id}, sourceId: #{source.id}, published: false, assessment: { evaluatorId: #{evaluator.id}, veracityId: #{veracity.id}  } }) {
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

    assert_equal Assessment::VERACITY_UNTRUE, result.data.createStatement.statement.assessment.veracity.key
    assert_equal Assessment::VERACITY_UNTRUE, Assessment.find(result.data.createStatement.statement.assessment.id).veracity_new
  end

  test "should create promise statement" do
    source_speaker = create(:source_speaker)
    source = create(:source, source_speakers: [source_speaker])
    evaluator = create(:user)

    result = execute(mutation("promise", source_speaker, source, evaluator), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.createStatement.statement.content
  end

  test "should fail with different type of statement" do
    source_speaker = create(:source_speaker)
    source = create(:source, source_speakers: [source_speaker])
    evaluator = create(:user)

    result = execute_with_errors(mutation("fake_news", source_speaker, source, evaluator), context: authenticated_user_context)

    assert_graphql_error "Argument 'statementType' on InputObject 'CreateStatementInput' has an invalid value (fake_news). Expected type 'StatementType!'.", result
  end
end
