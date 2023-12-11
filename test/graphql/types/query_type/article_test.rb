# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeArticleTest < GraphQLTestCase
  setup do
    ActiveStorage::Current.url_options = "https://example.com"
  end

  test "article should return given published article by id" do
    source_speaker = create(:source_speaker)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment = create(:article_segment_source_statements, source:)
    article = create(:fact_check, :with_illustration, title: "Lorem ipsum", published: true, segments: [segment])

    query_string =
      "
      query {
        article(id: #{
        article.id
      }) {
          id
          title
          debateStats {
            stats {
              true
            }
          }
          source {
            sourceSpeakers {
              fullName
            }
          }
          illustration(size: #{Article::ILLUSTRATION_SIZE_MEDIUM})
        }
      }"

    result = execute(query_string)

    assert_equal article.title, result.data.article.title
    assert_equal source_speaker.full_name, result.data.article.source.sourceSpeakers[0].fullName
    assert_match(/speaker\.png/, result.data.article.illustration)
  end

  test "article should return given published article by slug" do
    article = create(:fact_check, title: "Lorem ipsum", published: true)

    query_string =
      "
      query {
        article(slug: \"#{
        article.slug
      }\") {
          id
          title
          illustration
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = article.title
    actual = result.data.article.title

    assert_equal expected, actual
  end

  test "article should return error if required unpublished article without auth" do
    query_string =
      "
      query {
        article(includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute_with_errors(query_string)

    assert_auth_needed_error result
  end

  test "article should return given unpublished article by id if include unpublished flag is set with auth" do
    article = create(:fact_check, title: "Lorem ipsum", published: false)

    query_string =
      "
      query {
        article(id: #{
        article.id
      }, includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = article.title
    actual = result.data.article.title

    assert_equal expected, actual
  end

  test "article should return given unpublished article by slug if include unpublished flag is set with auth" do
    article = create(:fact_check, title: "Lorem ipsum", published: false)

    query_string =
      "
      query {
        article(slug: \"#{
        article.slug
      }\", includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute(query_string, context: authenticated_user_context)

    expected = article.title
    actual = result.data.article.title

    assert_equal expected, actual
  end

  test "article should return error if article is deleted" do
    article = create(:fact_check, title: "Lorem ipsum", published: true)

    # soft delete article
    article.discard

    query_string =
      "
      query {
        article(id: #{article.id}) {
          id
          title
        }
      }"

    result = execute_with_errors(query_string)

    assert_graphql_error("Could not find Article with id=#{article.id} or slug=", result)
  end

  test "article should return error if article is deleted among unpublished articles" do
    article = create(:fact_check, title: "Lorem ipsum", published: false)

    # soft delete article
    article.discard

    query_string =
      "
      query {
        article(id: #{
        article.id
      }, includeUnpublished: true) {
          id
          title
        }
      }"

    result = execute_with_errors(query_string, context: authenticated_user_context)

    assert_graphql_error("Could not find Article with id=#{article.id} or slug=", result)
  end
end
