# frozen_string_literal: true

require "graphql/graphql_testcase"

class TypeMediaTest < GraphQLTestCase
  test "media should return list of media" do
    medium = create(:medium)

    query_string = "
      query {
        media {
          id
          name
        }
      }"

    result = execute(query_string)

    assert_equal medium.name, result.data.media.first.name
  end
end
