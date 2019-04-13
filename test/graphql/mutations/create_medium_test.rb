# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateMediumMutationTest < GraphQLTestCase
  def mutation
    "
      mutation {
        createMedium(mediumInput: { name: \"Breaking News\"}) {
          medium {
            name
          }
        }
      }
    "
  end

  test "should require authentication" do
    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should create a medium" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "Breaking News", result.data.createMedium.medium.name
  end
end
