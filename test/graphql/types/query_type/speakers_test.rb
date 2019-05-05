# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakersTest < GraphQLTestCase
  test "speakers with portrait, body and stats should be returnable (Seznam.cz integration query)" do
    source = create(:source)
    create(:speaker, statement_source: source)

    query_string = "
      query {
        speakers(limit: 100, offset: 0) {
          id
          first_name
          last_name
          portrait
          body { # Political party
            short_name
          }
          stats {
            misleading
            true
            untrue
            unverifiable
          }
        }
      }
    "

    result = execute(query_string)
    assert_equal 1, result["data"]["speakers"].size

    result_speaker = result["data"]["speakers"][0]
    assert_equal "John", result_speaker["first_name"]
    assert_equal "Doe", result_speaker["last_name"]
    assert_equal 0, result_speaker["stats"]["misleading"]
    assert_equal 3, result_speaker["stats"]["true"]
    assert_equal 0, result_speaker["stats"]["untrue"]
    assert_equal 0, result_speaker["stats"]["unverifiable"]
  end
end
