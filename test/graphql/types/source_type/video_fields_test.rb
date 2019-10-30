# frozen_string_literal: true

require "graphql/graphql_testcase"

class SourceTypeVideoFieldsTest < GraphQLTestCase
  test "should include video type" do
    source = create(:source, video_type: :facebook)

    query_string =
      "
      query {
        source(id: #{source.id}) {
          videoType
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal "facebook", result.data.source.videoType
  end

  test "should include video id" do
    source = create(:source, video_id: "xyz")

    query_string =
      "
      query {
        source(id: #{source.id}) {
          videoId
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    assert_equal "xyz", result.data.source.videoId
  end
end
