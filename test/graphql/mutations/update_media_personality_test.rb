# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateMediaPersonalityMutationTest < GraphQLTestCase
  def mutation(media_personality)
    "
      mutation {
        updateMediaPersonality(id: #{media_personality.id}, mediaPersonalityInput: { name: \"Jane Doe\" }) {
          mediaPersonality {
            name
          }
        }
      }
    "
  end

  test "should require authentication" do
    media_personality = create(:media_personality)

    result = execute_with_errors(mutation(media_personality))

    assert_auth_needed_error result
  end

  test "should create a media personality" do
    media_personality = create(:media_personality)

    result = execute(mutation(media_personality), context: authenticated_user_context)

    assert_equal "Jane Doe", result.data.updateMediaPersonality.mediaPersonality.name
  end
end
