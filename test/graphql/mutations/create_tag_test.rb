# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateTagMutationTest < GraphQLTestCase
  def mutation(tag_name, statement_type)
    "
      mutation {
        createTag(tagInput: { name: \"#{tag_name}\", forStatementType: #{
      statement_type
    } }) {
          tag {
            name
            forStatementType
          }
        }
      }
    "
  end

  test "should require authentication" do
    result = execute_with_errors(mutation("Tag name", Statement::TYPE_FACTUAL))

    assert_auth_needed_error result
  end

  test "should create a tag" do
    result =
      execute(mutation("Tag name", Statement::TYPE_FACTUAL), context: authenticated_user_context)

    assert_equal "Tag name", result.data.createTag.tag.name
    assert_equal Statement::TYPE_FACTUAL, result.data.createTag.tag.forStatementType
  end
end
