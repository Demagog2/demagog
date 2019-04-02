# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateSpeakerMutationTest < GraphQLTestCase
  def mutation(speaker)
    "
      mutation {
        updateSpeaker(id: #{speaker.id}, speakerInput: { firstName: \"Jane\", lastName: \"Doe\", memberships: []}) {
          speaker {
            id
            firstName
          }
        }
      }
    "
  end

  test "should required authentication" do
    speaker = create(:speaker)

    result = execute_with_errors(mutation(speaker))

    assert_auth_needed_error result
  end

  test "should update existing body" do
    speaker = create(:speaker)

    result = execute(mutation(speaker), context: authenticated_user_context)

    assert_equal "Jane", result.data.updateSpeaker.speaker.firstName
  end
end
