# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSearchTest < GraphQLTestCase
  def setup
    elasticsearch_index [Speaker]
  end

  test "get most searched speakers" do
    speaker_one = create(:speaker, first_name: "John", last_name: "Doe")
    speaker_one.__elasticsearch__.index_document
    speaker_two = create(:speaker, first_name: "John", last_name: "Brown")
    speaker_two.__elasticsearch__.index_document

    speaker_one.__elasticsearch__.client.indices.refresh index: speaker_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchSpeakers(term: "Doe") {
          speakers {
            id
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal [speaker_one.id.to_s], result["data"]["searchSpeakers"]["speakers"].pluck("id")
    assert_equal 1, result["data"]["searchSpeakers"]["totalCount"]
  end

  def teardown
    elasticsearch_cleanup [Speaker]
  end
end
