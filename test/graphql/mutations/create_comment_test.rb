# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateCommentMutationTest < GraphQLTestCase
  def mutation(statement)
    "
      mutation {
        createComment(commentInput: { content: \"Hello, World!\", statementId: #{statement.id} }) {
          comment {
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

  test "should create a comment" do
    statement = create(:statement)

    result = execute(mutation(statement), context: authenticated_user_context)

    assert_equal "Hello, World!", result.data.createComment.comment.content
  end
end
