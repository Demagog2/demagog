# frozen_string_literal: true

require "graphql/graphql_testcase"

class DeleteMediaPersonalityMutationTest < GraphQLTestCase
  def mutation(media_personality)
    "
      mutation {
        deleteMediaPersonality(id: #{media_personality.id}) {
          id
        }
      }
    "
  end

  test "should require authentication" do
    media_personality = create(:media_personality)

    result = execute_with_errors(mutation(media_personality))

    assert_auth_needed_error result
  end

  test "should delete given media personality" do
    media_personality = create(:media_personality)

    result = execute(mutation(media_personality), context: authenticated_user_context)

    assert_equal media_personality.id.to_s, result.data.deleteMediaPersonality.id
  end
end
