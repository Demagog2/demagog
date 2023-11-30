# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakerTest < GraphQLTestCase
  test "should return given speaker" do
    speaker = create(:speaker)
    create(:statement, source_speaker: create(:source_speaker, speaker:))

    query_string = "
      query {
        speaker(id: #{speaker.id}) {
          id
          firstName
          lastName
          fullName
          verifiedStatementsCount
        }
      }
    "

    result = execute(query_string)

    assert_equal speaker.first_name, result.data.speaker.firstName
    assert_equal speaker.last_name, result.data.speaker.lastName
    assert_equal speaker.full_name, result.data.speaker.fullName
    assert_equal 1, result.data.speaker.verifiedStatementsCount
  end
end
