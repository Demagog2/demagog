# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteSpeakerMutationTest < GraphQLTestCase
  def mutation(speaker)
    "
      mutation {
        deleteSpeaker(id: #{speaker.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    body = create(:body)

    result = execute_with_errors(mutation(body))

    assert_auth_needed_error result
  end

  test "should delete given speaker" do
    speaker = create(:speaker)

    result = execute(mutation(speaker), context: authenticated_user_context)

    assert_equal speaker.id.to_s, result.data.deleteSpeaker.id
  end
end
