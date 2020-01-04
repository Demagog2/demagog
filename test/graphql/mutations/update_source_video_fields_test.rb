# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateSourceVideoFieldsMutationTest < GraphQLTestCase
  def mutation(source, video_type, video_id)
    "
      mutation {
        updateSourceVideoFields(id: #{
      source.id
    }, sourceVideoFieldsInput: { videoType: \"#{video_type}\", videoId: \"#{
      video_id
    }\" }) {
          source {
            videoType
            videoId
          }
        }
      }
    "
  end

  test "should require authentication" do
    source = create(:source)

    result = execute_with_errors(mutation(source, "youtube", "xyz"))

    assert_auth_needed_error result
  end

  test "should update given source" do
    source = create(:source)

    video_type = "youtube"
    video_id = "xyz"

    result = execute(mutation(source, video_type, video_id), context: authenticated_user_context)

    assert_equal video_type, result.data.updateSourceVideoFields.source.videoType
    assert_equal video_id, result.data.updateSourceVideoFields.source.videoId
  end
end
