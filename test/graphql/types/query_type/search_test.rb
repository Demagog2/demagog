# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeSearchTest < GraphQLTestCase
  def setup
    elasticsearch_index [Speaker, Article, Statement]
  end

  test "search speakers" do
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
    statement_one = create(:statement, content: "Something he said and loads more", tags: [tag_foo, tag_bar])
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
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal "Bez tématu", result["data"]["searchStatements"]["tags"][0]["tag"]["name"]
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
  end

  test "search statements - filter by tags" do
    tag = create(:tag, name: "Foo")
    statement_one = create(:statement, content: "Something he said and loads more", tags: [tag])
    statement_two = create(:statement, content: "Something he said and loads more", tags: [])

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { tags: [#{tag.id}] }) {
          statements {
            id
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i
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
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i
  end

  test "search statements - filter by year" do
    statement_one = create(:statement, content: "Something he said and loads more")
    statement_one.source.update!(released_at: "1990-01-01")
    statement_two = create(:statement, content: "Something he said and loads more")

    statement_one.__elasticsearch__.index_document
    statement_two.__elasticsearch__.index_document

    statement_one.__elasticsearch__.client.indices.refresh index: statement_one.__elasticsearch__.index_name

    query_string = <<~GRAPHQL
      query {
        searchStatements(term: "Something he said", includeAggregations: true, filters: { years: [1990] }) {
          statements {
            id
          }
          totalCount
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal 1, result["data"]["searchStatements"]["totalCount"]
    assert_equal statement_one.id, result["data"]["searchStatements"]["statements"][0]["id"].to_i
  end

  def teardown
    elasticsearch_cleanup [Speaker, Article, Statement]
  end
end
