# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakersTest < GraphQLTestCase
  test "speakers with portrait, body and stats should be returnable (Seznam.cz integration query)" do
    source = create(:source)
    speaker = create(:speaker, statement_source: source)

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

    result = execute_with_errors(query_string).to_h
    assert result["data"]["speakers"].size == 1

    result_speaker = result["data"]["speakers"][0]
    assert result_speaker["first_name"] == "John"
    assert result_speaker["last_name"] == "Doe"
    assert result_speaker["stats"]["misleading"] == 0
    assert result_speaker["stats"]["true"] == 3
    assert result_speaker["stats"]["untrue"] == 0
    assert result_speaker["stats"]["unverifiable"] == 0
  end
end
