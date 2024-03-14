# frozen_string_literal: true

require "graphql/graphql_testcase"

module Schema::Articles
  class GovernmentPromisesEvaluationFieldTest < GraphQLTestCase
    test "returns null if government promise evaluation not found" do
      query_string = <<~GRAPHQL
        query {
          governmentPromisesEvaluationBySlug(slug: "xyz") {
            id
          }
        }
      GRAPHQL

      result = execute(query_string)

      assert_nil result.data.governmentPromisesEvaluationBySlug
    end

    test "returns government promises evaluation articles" do
      source = create(:source)
      statement = create(:statement, :promise_statement, source:)
      article = create(:article, :government_promises_evaluation)
      create(:article_segment_source_statements, article:, source:)

      query_string = <<~GRAPHQL
      query {
        governmentPromisesEvaluationBySlug(slug: "#{article.slug}") {
          id
          slug
          title
          perex
          promiseCount
          promises {
            id
            title
            content
            source {
              url
              label
            }
            promiseRating {
              key
              name
            }
            shortExplanation
            explanationHtml
            area {
              id
              name
            }
          }
          stats {
            key
            count
            percentage
          }
        }
      }
      GRAPHQL

      result = execute(query_string)

      assert_equal article.slug, result.data.governmentPromisesEvaluationBySlug.slug
      assert_equal article.title, result.data.governmentPromisesEvaluationBySlug.title
      assert_equal article.perex, result.data.governmentPromisesEvaluationBySlug.perex
      assert_equal 1, result.data.governmentPromisesEvaluationBySlug.promiseCount
      assert_equal statement.id.to_s, result.data.governmentPromisesEvaluationBySlug.promises.first.id
      assert_equal PromiseRating::FULFILLED, result.data.governmentPromisesEvaluationBySlug.promises.first.promiseRating.key
      assert_equal statement.assessment.short_explanation, result.data.governmentPromisesEvaluationBySlug.promises.first.shortExplanation
      assert_equal statement.assessment.explanation_html, result.data.governmentPromisesEvaluationBySlug.promises.first.explanationHtml
      assert_equal({ key: "fulfilled", count: 1, percentage: 100 }, result.data.governmentPromisesEvaluationBySlug.stats[0].to_h)
    end
  end
end
