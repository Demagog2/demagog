# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakerTest < GraphQLTestCase
  def setup
    allow_net_connect!
    elasticsearch_index [Speaker, Statement]
  end

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

  test "should return speaker with avatar" do
    speaker = create(:speaker, :with_avatar)

    query_string = "
      query {
        speaker(id: #{speaker.id}) {
          id
          avatar
        }
      }
    "

    result = execute(query_string)

    assert_match(/active_storage/, result.data.speaker.avatar)
  end

  test "should return speaker with small avatar" do
    speaker = create(:speaker, :with_avatar)

    query_string = "
      query {
        speaker(id: #{speaker.id}) {
          id
          avatar(size: small)
        }
      }
    "

    result = execute(query_string)

    assert_match(/active_storage/, result.data.speaker.avatar)
  end

  test "should search statements in context of given speaker" do
    statement_one = create(:statement, :important, content: "Something he said and loads more")
    statement_two = create(:statement, content: "Something he said and loads more")

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        speaker(id: #{statement_one.source_speaker.speaker.id}) {
          searchStatements(term: "Something he said", includeAggregations: true) {
            statements {
              id
            }
            totalCount
          }
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["speaker"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["speaker"]["searchStatements"]["statements"][0]["id"].to_i
  end

  def teardown
    elasticsearch_cleanup [Speaker, Statement]
    disable_net_connect!
  end
end
