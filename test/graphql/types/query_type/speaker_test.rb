# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakerTest < GraphQLTestCase
  test "should return given speaker" do
    speaker = create(:speaker)

    query_string = "
      query {
        speaker(id: #{speaker.id}) {
          id
          firstName
          lastName
        }
      }
    "

    result = execute(query_string)

    assert_equal speaker.first_name, result.data.speaker.firstName
    assert_equal speaker.last_name, result.data.speaker.lastName
  end
end
