# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateStatementsVideoMarksMutationTest < GraphQLTestCase
  def mutation(source, updated_video_marks)
    input =
      updated_video_marks.map do |updated_video_mark|
        statement_id, start, stop = updated_video_mark

        "{ statementId: #{statement_id}, start: #{start}, stop: #{stop} }"
      end

    "
      mutation {
        updateStatementsVideoMarks(id: #{
      source.id
    }, statementsVideoMarksInput: [#{
      input.join(",")
    }]) {
          statements {
            id
            statementVideoMark {
              id
              start
              stop
            }
          }
        }
      }
    "
  end

  test "should require authentication" do
    source = create(:source)

    result = execute_with_errors(mutation(source, []))

    assert_auth_needed_error result
  end

  test "should update given source" do
    source = create(:source)
    statement = create(:statement, source:)

    result =
      execute(mutation(source, [[statement.id, 10, 50]]), context: authenticated_user_context)

    assert_equal 10, result.data.updateStatementsVideoMarks.statements[0].statementVideoMark.start
    assert_equal 50, result.data.updateStatementsVideoMarks.statements[0].statementVideoMark.stop

    statement.reload
    assert_equal 10, statement.statement_video_mark.start
    assert_equal 50, statement.statement_video_mark.stop
  end
end
