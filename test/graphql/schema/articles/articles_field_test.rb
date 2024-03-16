# frozen_string_literal: true

require "graphql/graphql_testcase"

module Schema::Articles
  class ArticlesFieldTest < GraphQLTestCase
    test "should return homepage articles" do
      create_list(:fact_check, 4, published: true)
      article = create(:article, :single_statement, published: true)
      article.segments << create(:article_segment_single_statement)

      query_string = "
      query {
        homepageArticles {
          id
        }
        homepageArticlesV2 {
          nodes {
            id
          }
        }
        homepageArticlesV3 {
          nodes {
            ... on Article {
              id
            }
            ... on SingleStatementArticle {
              id
              statement {
                id
                content
              }
            }
          }
        }
      }"

      result = execute(query_string)

      assert_equal 5, result.data.homepageArticles.size
      assert_equal 5, result.data.homepageArticlesV2.nodes.size
      assert_equal 5, result.data.homepageArticlesV3.nodes.size

      assert_not_nil result.data.homepageArticlesV3.nodes.first.statement
    end

    test "articles should return published articles by default" do
      create_list(:fact_check, 5, published: true)

      query_string = "
      query {
        articles {
          id
        }
      }"

      result = execute(query_string)

      assert_equal 5, result.data.articles.size
    end

    test "articles should return only published without any args" do
      create_list(:fact_check, 5, published: false)

      query_string = "
      query {
        articles(includeUnpublished: true) {
          id
        }
      }"

      result = execute(query_string, context: authenticated_user_context)

      assert_equal 5, result.data.articles.size
    end

    test "articles return error when trying to get unpublished without auth" do
      create_list(:fact_check, 10)

      query_string = "
      query {
        articles(includeUnpublished: true) {
          id
        }
      }"

      result = execute_with_errors(query_string)

      assert_auth_needed_error result
    end

    test "articles return articles matching title" do
      create(:fact_check, title: "Lorem ipsum", published: true)
      create(:fact_check, title: "Sit amet", published: true)

      query_string = "
      query {
        articles(title: \"Lorem\") {
          id
          title
        }
      }"

      result = execute(query_string)
      expected = ["Lorem ipsum"]

      assert_equal expected, result.data.articles.map { |p| p.title }
    end

    test "returns government promeiss evaluation articles among articles if enabled" do
      article_statement = create(:article, :single_statement)
      article_promises = create(:article, :government_promises_evaluation)

      Flipper.enable("government_promises_evaluations", authenticated_user_context[:current_user])

      query_string = <<~GRAPHQL
      query {
        articles {
          id
          title
        }
      }
      GRAPHQL

      result = execute(query_string, context: authenticated_user_context)

      assert_equal [article_statement.id.to_s, article_promises.id.to_s].sort, result.data.articles.pluck(:id).sort
    end

    test "returns government promises evaluation articles" do
      create(:article, :single_statement)
      create_list(:article, 5, :government_promises_evaluation)
      create(:article, :government_promises_evaluation, :unpublished)

      query_string = <<~GRAPHQL
      query {
        governmentPromisesEvaluations {
          id
          promiseCount
        }
      }
      GRAPHQL

      result = execute(query_string)

      assert_equal 5, result.data.governmentPromisesEvaluations.count
    end

    test "returns facebook factchecks articles" do
      create_list(:article, 10, :facebook_factcheck)

      query_string = <<~GRAPHQL
      query {
        facebookFactchecks(first: 5) {
          nodes {
            id
          }
        }
      }
      GRAPHQL

      result = execute(query_string)

      assert_equal 5, result.data.facebookFactchecks.nodes.count
    end
  end
end
