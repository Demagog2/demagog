# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateSourceMutationTest < GraphQLTestCase
  def mutation(source, medium, media_personality)
    "
      mutation {
        updateSource(id: #{source.id}, sourceInput: { name: \"My source\", releasedAt: \"2018-01-01\", mediumId: #{medium.id},  mediaPersonalities: [#{media_personality.id}], transcript: \"Lorem ipsum\", sourceSpeakers: [], experts: [] }) {
          source {
            name
          }
        }
      }
    "
  end

  test "should require authentication" do
    source = create(:source)

    medium = create(:medium)
    media_personality = create(:media_personality)

    result = execute_with_errors(mutation(source, medium, media_personality))

    assert_auth_needed_error result
  end

  test "should update given source" do
    source = create(:source)

    medium = create(:medium)
    media_personality = create(:media_personality)

    result = execute(mutation(source, medium, media_personality), context: authenticated_user_context)

    assert_equal "My source", result.data.updateSource.source.name
  end
end
