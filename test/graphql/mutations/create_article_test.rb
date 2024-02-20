# frozen_string_literal: true

require "graphql/graphql_testcase"

class CreateArticleMutationTest < GraphQLTestCase
  def mutation
    "
      mutation {
        createArticle(articleInput: { articleType: \"default\", title: \"Breaking News\", perex: \"Lorem ipsum...\", segments: [] }) {
          article {
            title
          }
        }
      }
    "
  end

  test "should require authentication" do
    result = execute_with_errors(mutation)

    assert_auth_needed_error result
  end

  test "should create an article" do
    result = execute(mutation, context: authenticated_user_context)

    assert_equal "Breaking News", result.data.createArticle.article.title
  end

  test "create government promises evaluation article" do
    assessment_methodology = create(:assessment_methodology, :promises_legacy)

    mutation = <<~GRAPHQL
      mutation {
        createArticle(articleInput: { articleType: \"default\", title: \"Breaking News\", perex: \"Lorem ipsum...\", segments: [], assessmentMethodologyId: "#{assessment_methodology.id}" }) {
          article {
            assessmentMethodology {
              id
            }
          }
        }
      }
    GRAPHQL

    result = execute(mutation, context: authenticated_user_context)

    assert_equal assessment_methodology.id.to_s, result.data.createArticle.article.assessmentMethodology.id
  end
end
