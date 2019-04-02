# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateSpeakerMutationTest < GraphQLTestCase
  def mutation
    "
      mutation {
        createSpeaker(speakerInput: { firstName: \"John\", lastName: \"Doe\", memberships: [] }) {
          speaker {
            id
            firstName
            lastName
          }
        }
      }
    "
  end

  test "should required authentication" do
    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should create a speaker" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "John", result.data.createSpeaker.speaker.firstName
    assert_equal "Doe", result.data.createSpeaker.speaker.lastName
  end
end
