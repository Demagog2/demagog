# frozen_string_literal: true

require "graphql/graphql_testcase"

class TypeMediaPersonalitiesTest < GraphQLTestCase
  test "media should return list of media" do
    media_personality = create(:media_personality)

    query_string = "
      query {
        mediaPersonalities {
          id
          name
        }
      }"

    result = execute(query_string)

    assert_equal media_personality.name, result.data.mediaPersonalities.first.name
  end
end
