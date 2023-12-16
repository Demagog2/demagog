# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSpeakersTest < GraphQLTestCase
  test "speakers with portrait, body and stats should be returnable (Seznam.cz integration query)" do
    source_speaker = create(:source_speaker)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [
          create(:statement, source_speaker:),
          create(:statement, source_speaker:),
          create(:statement, source_speaker:)
        ]
      )
    segment = create(:article_segment_source_statements, source:)
    create(:fact_check, segments: [segment])

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

  test "get most searched speakers" do
    # TODO: Add mocking library?
    Speaker::MOST_SEARCHED_SPEAKER_IDS.each do |id|
      create(:speaker, id:)
    end

    query_string = <<~GRAPHQL
      query {
        getMostSearchedSpeakers {
          id
        }
      }
    GRAPHQL

    result = execute(query_string)

    ids = result["data"]["getMostSearchedSpeakers"].pluck(:id).map(&:to_i)

    assert_equal Speaker::MOST_SEARCHED_SPEAKER_IDS, ids
  end

  test "get president and govermental speakers" do
    # TODO: Add mocking library?
    Speaker::MOST_IMPORTANT_SPEAKER_IDS.each do |id|
      create(:speaker, id:)
    end

    query_string = <<~GRAPHQL
      query {
        getPresidentAndGovermentSpeakers {
          id
        }
      }
    GRAPHQL

    result = execute(query_string)

    ids = result["data"]["getPresidentAndGovermentSpeakers"].pluck(:id).map(&:to_i)

    assert_equal Speaker::MOST_IMPORTANT_SPEAKER_IDS, ids
  end
end
