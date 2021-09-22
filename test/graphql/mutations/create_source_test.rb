# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateSourceMutationTest < GraphQLTestCase
  def mutation(medium, media_personality)
    "
      mutation {
        createSource(sourceInput: { name: \"John Doe\", releasedAt: \"2018-01-01\", mediumId: #{
      medium.id
    },  mediaPersonalities: [#{media_personality.id}], transcript: \"Lorem ipsum\", sourceSpeakers: [], experts: [] }) {
          source {
            name
          }
        }
      }
    "
  end

  def mutation_minimalistic(name:)
    "
      mutation {
        createSource(sourceInput: { name: \"#{
      name
    }\" }) {
          source {
            name
            medium {
              name
            }
          }
        }
      }
    "
  end

  test "should require authentication" do
    medium = create(:medium)
    media_personality = create(:media_personality)

    result = execute_with_errors(mutation(medium, media_personality))

    assert_auth_needed_error result
  end

  test "should require only name" do
    result =
      execute(
        mutation_minimalistic(name: "Minimalistic discussion"),
        context: authenticated_user_context
      )

    assert_equal "Minimalistic discussion", result.data.createSource.source.name
  end

  test "should create a source" do
    medium = create(:medium)
    media_personality = create(:media_personality)

    result =
      execute(mutation(medium, media_personality), context: authenticated_user_context)

    assert_equal "John Doe", result.data.createSource.source.name
  end
end
