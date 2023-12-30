# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSearchTest < GraphQLTestCase
  def setup
    elasticsearch_index [Speaker, Article, Statement]
  end

  test "search speakers" do
    source = create(:source)

    speaker_one = create(:speaker, first_name: "John", last_name: "Doe")
    create_list(:statement, 5, source:, source_speaker: create(:source_speaker, source:, speaker: speaker_one))
    speaker_one.__elasticsearch__.index_document
    speaker_two = create(:speaker, first_name: "John", last_name: "Brown")
    create_list(:statement, 5, source:, source_speaker: create(:source_speaker, source:, speaker: speaker_two))
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

  test "search speakers with bodies filter" do
    source = create(:source)

    party_one = create(:party, id: Body.get_lower_parliament_body_ids.first, name: "Party 1", short_name: "P1")
    speaker_one = create(:speaker, first_name: "John", last_name: "Doe")
    create(:membership, :current, speaker: speaker_one, body: party_one)
    create_list(:statement, 5, source:, source_speaker: create(:source_speaker, source:, speaker: speaker_one))
    speaker_one.__elasticsearch__.index_document
    speaker_two = create(:speaker, first_name: "Jane", last_name: "Doe")
    create_list(:statement, 5, source:, source_speaker: create(:source_speaker, source:, speaker: speaker_two))
    speaker_two.__elasticsearch__.index_document

    speaker_one.__elasticsearch__.client.indices.refresh index: speaker_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchSpeakers(term: "Doe", filters: { bodies: ["#{party_one.id}"] }) {
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

  test "search speakers with aggregations" do
    skip("CircleCI collate compatibility issue")
    source = create(:source)

    party_one = create(:party, id: Body.get_lower_parliament_body_ids.first, name: "Party 1", short_name: "P1")
    speaker_one = create(:speaker, first_name: "John", last_name: "Doe")
    create(:membership, :current, speaker: speaker_one, body: party_one)
    create_list(:statement, 5, source:, source_speaker: create(:source_speaker, source:, speaker: speaker_one))
    speaker_one.__elasticsearch__.index_document

    party_two = create(:party, id: Body.get_lower_parliament_body_ids.max + 1, name: "Party 2", short_name: "P2")
    speaker_two = create(:speaker, first_name: "John", last_name: "Brown")
    create(:membership, :current, speaker: speaker_two, body: party_two)
    create_list(:statement, 5, source:, source_speaker: create(:source_speaker, source:, speaker: speaker_two))
    speaker_two.__elasticsearch__.index_document

    speaker_one.__elasticsearch__.client.indices.refresh index: speaker_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchSpeakers(term: "Doe", includeAggregations: true, filters: { bodies: ["#{party_one.id}"] }) {
          speakers {
            id
          }
          bodyGroups {
            name
            bodies {
              body {
                id
              }
              isSelected
              count
            }
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 2, result["data"]["searchSpeakers"]["bodyGroups"].size
    assert_equal I18n.t("aggregations.body_groups.parliamentary"), result["data"]["searchSpeakers"]["bodyGroups"][0]["name"]
    assert_equal 1, result["data"]["searchSpeakers"]["bodyGroups"][0]["bodies"].size
    assert_equal party_one.id.to_s, result["data"]["searchSpeakers"]["bodyGroups"][0]["bodies"][0]["body"]["id"]
    assert_equal true, result["data"]["searchSpeakers"]["bodyGroups"][0]["bodies"][0]["isSelected"]
    assert_equal 1, result["data"]["searchSpeakers"]["bodyGroups"][0]["bodies"][0]["count"]

    assert_equal I18n.t("aggregations.body_groups.others"), result["data"]["searchSpeakers"]["bodyGroups"][1]["name"]
    assert_equal 1, result["data"]["searchSpeakers"]["bodyGroups"][1]["bodies"].size
  end

  test "search articles" do
    article_one = create(:article, title: "Lorem ipsum")
    article_one.__elasticsearch__.index_document

    article_one.__elasticsearch__.client.indices.refresh index: article_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchArticles(term: "Lorem") {
          articles {
            id
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal [article_one.id.to_s], result["data"]["searchArticles"]["articles"].pluck("id")
    assert_equal 1, result["data"]["searchArticles"]["totalCount"]
  end

  test "search statements" do
    statement_one = create(:statement, content: "Something he said and loads more")
    statement_one.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said") {
          statements {
            id
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal [statement_one.id.to_s], result["data"]["searchStatements"]["statements"].pluck("id")
    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
  end

  test "search statements with aggregates" do
    tag_bar = create(:tag, name: "Bar")
    tag_foo = create(:tag, name: "Foo")
    statement_one = create(:statement, :important, content: "Something he said and loads more", tags: [tag_foo, tag_bar])
    statement_one.source.update!(released_at: "2022-01-01")
    statement_two = create(:statement, content: "Something he said and loads more", tags: [tag_foo])
    statement_two.source.update!(released_at: "2021-01-01")

    # Statement without tags
    statements_without_tags = create_list(:statement, 5, source: create(:source, released_at: "2020-01-01"), tags: [])

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document
    statements_without_tags.each { |statement| statement.__elasticsearch__.index_document }
    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { tags: [#{tag_bar.id}] }) {
          statements {
            id
          }
          tags {
            tag {
              id
              name
            }
            isSelected
            count
          }
          veracities {
            veracity {
              id
              key
            }
            count
          }
          years {
            year
            count
          }
          editorPicked {
            count
            isSelected
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal "Bez tématu", result["data"]["searchStatements"]["tags"][0]["tag"]["name"]
    assert_equal false, result["data"]["searchStatements"]["tags"][0]["isSelected"]
    assert_equal 5, result["data"]["searchStatements"]["tags"][0]["count"]

    assert_equal tag_foo.name, result["data"]["searchStatements"]["tags"][1]["tag"]["name"]
    assert_equal 2, result["data"]["searchStatements"]["tags"][1]["count"]

    assert_equal tag_bar.name, result["data"]["searchStatements"]["tags"][2]["tag"]["name"]
    assert_equal 1, result["data"]["searchStatements"]["tags"][2]["count"]

    assert_equal Veracity::TRUE, result["data"]["searchStatements"]["veracities"][0]["veracity"]["key"]
    assert_equal 7, result["data"]["searchStatements"]["veracities"][0]["count"]

    assert_equal 2022, result["data"]["searchStatements"]["years"][0]["year"]
    assert_equal 1, result["data"]["searchStatements"]["years"][0]["count"]

    assert_equal 2021, result["data"]["searchStatements"]["years"][1]["year"]
    assert_equal 1, result["data"]["searchStatements"]["years"][1]["count"]

    assert_equal 1, result["data"]["searchStatements"]["editorPicked"]["count"]
    assert_equal false, result["data"]["searchStatements"]["editorPicked"]["isSelected"]
  end

  test "search statements - filter by tags" do
    tag = create(:tag, name: "Foo")
    tag_other = create(:tag, name: "Bar")
    statement_one = create(:statement, content: "Something he said and loads more", tags: [tag])
    statement_two = create(:statement, content: "Something he said and loads more", tags: [tag_other])

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { tags: [#{tag.id}] }) {
          statements {
            id
          }
          tags {
            tag {
              id
            }
            isSelected
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i


    assert_equal tag_other.id, result["data"]["searchStatements"]["tags"][0]["tag"]["id"].to_i
    assert_equal false, result["data"]["searchStatements"]["tags"][0]["isSelected"]

    assert_equal tag.id, result["data"]["searchStatements"]["tags"][1]["tag"]["id"].to_i
    assert_equal true, result["data"]["searchStatements"]["tags"][1]["isSelected"]
  end

  test "search statements - filter by veracity" do
    veracity_true = create(:veracity)
    veracity_untrue = create(:veracity, key: Veracity::UNTRUE)

    statement_one = create(:statement, content: "Something he said and loads more")
    statement_two = create(:statement, content: "Something he said and loads more")

    statement_two.assessment.update!(veracity: veracity_untrue)

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { veracities: ["#{veracity_true.key}"] }) {
          statements {
            id
          }
          veracities {
            veracity {
              key
            }
            isSelected
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i

    assert_equal true, result["data"]["searchStatements"]["veracities"][0]["isSelected"]
    assert_equal false, result["data"]["searchStatements"]["veracities"][1]["isSelected"]
  end

  test "search statements - filter by year" do
    statement_one = create(:statement, content: "Something he said and loads more")
    statement_one.source.update!(released_at: "1990-01-01")
    statement_two = create(:statement, content: "Something he said and loads more")
    statement_two.source.update!(released_at: "2010-01-01")

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { years: [1990] }) {
          statements {
            id
          }
          years {
            year
            isSelected
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i

    assert_equal 2010, result["data"]["searchStatements"]["years"][0]["year"]
    assert_equal false, result["data"]["searchStatements"]["years"][0]["isSelected"]

    assert_equal 1990, result["data"]["searchStatements"]["years"][1]["year"]
    assert_equal true, result["data"]["searchStatements"]["years"][1]["isSelected"]
  end

  test "search statements - filter by editor picked" do
    statement_one = create(:statement, :important, content: "Something he said and loads more")
    statement_two = create(:statement, content: "Something he said and loads more")

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { editorPicked: true }) {
          statements {
            id
          }
          editorPicked {
            isSelected
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i
    assert_equal true, result["data"]["searchStatements"]["editorPicked"]["isSelected"]
  end

  def teardown
    elasticsearch_cleanup [Speaker, Article, Statement]
  end
end
