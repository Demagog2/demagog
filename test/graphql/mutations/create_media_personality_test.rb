# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateMediaPersonalityMutationTest < GraphQLTestCase
  def mutation
    "
      mutation {
        createMediaPersonality(mediaPersonalityInput: { name: \"John Doe\"}) {
          mediaPersonality {
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

  test "should create a media personality" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "John Doe", result.data.createMediaPersonality.mediaPersonality.name
  end
end
