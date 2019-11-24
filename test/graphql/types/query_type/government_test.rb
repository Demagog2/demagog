# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeGovernmentTest < GraphQLTestCase
  test "should query government" do
    government = create(:government, name: "Government of John Doe")
    government.ministers << build(:minister, speaker: create(:speaker))

    query_string =
      "
      query {
        government(id: #{
        government.id
      }) {
          id
          name
          ministers {
            id
            name
            ordering
            speaker {
              id
              firstName
              lastName
            }
          }
        }
      }"

    result = execute(query_string)

    assert_equal government.name, result.data.government.name
    assert_equal 1, government.ministers.length
    assert_equal "John", government.ministers.first.speaker.first_name
  end
end
