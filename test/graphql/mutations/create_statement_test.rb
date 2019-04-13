# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateStatementMutationTest < GraphQLTestCase
  def mutation(speaker, source)
    "
      mutation {
        createStatement(statementInput: { content: \"Lorem ipsum\", excerptedAt: \"2018-01-01\", important: false, speakerId: #{speaker.id}, sourceId: #{source.id}, published: true, countInStatistics: false, assessment: { shortExplanation: \"Dolor sit amet\"} }) {
          statement {
            content
          }
        }
      }
    "
  end

  test "should require authentication" do
    speaker = create(:speaker)
    source = create(:source)

    result = execute_with_errors(mutation(speaker, source))

    assert_auth_needed_error result
  end

  test "should create a statement" do
    speaker = create(:speaker)
    source = create(:source)

    result = execute(mutation(speaker, source), context: authenticated_user_context)

    assert_equal "Lorem ipsum", result.data.createStatement.statement.content
  end
end
