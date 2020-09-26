# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateStatementMutationTest < GraphQLTestCase
  def mutation(statement_type, speaker, source, evaluator, secondary_evaluators = [])
    "
      mutation {
        createStatement(statementInput: { statementType: #{
      statement_type
    }, content: \"Lorem ipsum\", excerptedAt: \"2018-01-01\", important: false, speakerId: #{
      speaker.id
    }, sourceId: #{source.id}, published: false, assessment: { evaluatorId: #{
      evaluator.id
    }, secondaryEvaluatorIds: [#{
      secondary_evaluators.map(&:id).join(", ")
    }] } }) {
          statement {
            id
            content
          }
        }
      }
    "
  end

  test "should require authentication" do
    speaker = create(:speaker)
    source = create(:source)
    evaluator = create(:user)

    result = execute_with_errors(mutation("factual", speaker, source, evaluator))

    assert_auth_needed_error result
  end

  test "should create factual statement" do
    speaker = create(:speaker)
    source = create(:source)
    evaluator = create(:user)

    result =
      execute(mutation("factual", speaker, source, evaluator), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.createStatement.statement.content
  end

  test "should create promise statement" do
    speaker = create(:speaker)
    source = create(:source)
    evaluator = create(:user)

    result =
      execute(mutation("promise", speaker, source, evaluator), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.createStatement.statement.content
  end

  test "should assign secondary evaluators" do
    speaker = create(:speaker)
    source = create(:source)
    evaluator = create(:user)
    secondary_evaluators = create_list(:user, 2)

    result =
      execute(
        mutation("factual", speaker, source, evaluator, secondary_evaluators),
        context: authenticated_user_context
      )

    id = result.data.createStatement.statement.id

    assessment = Statement.find(id).assessment
    assert_includes assessment.secondary_evaluators, secondary_evaluators[0]
    assert_includes assessment.secondary_evaluators, secondary_evaluators[1]
  end

  test "should fail with different type of statement" do
    speaker = create(:speaker)
    source = create(:source)
    evaluator = create(:user)

    result =
      execute_with_errors(
        mutation("fake_news", speaker, source, evaluator),
        context: authenticated_user_context
      )

    assert_graphql_error "Argument 'statementType' on InputObject 'CreateStatementInput' has an invalid value (fake_news). Expected type 'StatementType!'.",
                         result
  end
end
