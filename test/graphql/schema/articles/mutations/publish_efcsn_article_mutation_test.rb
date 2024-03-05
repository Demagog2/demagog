# frozen_string_literal: true

require "graphql/graphql_testcase"
require "webmock/minitest"

module Schema::Articles::Mutations
  class PublishEfcsnArticleMutationTest < GraphQLTestCase
    def setup
      @article = create(:article)
    end

    def mutation
      "
      mutation {
        publishEfcsnArticle(input: { articleId: #{@article.id} }) {
          ... on PublishEfcsnArticleSuccess {
            article {
              efcsnExternalId
              efcsnCreatedAt
              efcsnUpdatedAt
            }
          }
          ... on PublishEfcsnArticleError {
            message
          }
        }
      }
    "
    end

    test "should require authentication" do
      result = execute_with_errors(mutation)

      assert_auth_needed_error result
    end

    test "should publish an efcsn article" do
      WebMock.stub_request(:post, "https://example.com/articles")
             .to_return(body: expected_data.to_json, status: 200)

      result = execute(mutation, context: authenticated_user_context)

      assert_equal @article.reload.efcsn_external_id, result.data.publishEfcsnArticle.article.efcsnExternalId
    end

    test "should return erorr message" do
      WebMock.stub_request(:post, "https://example.com/articles")
             .to_return(body: {}.to_json, status: 400)

      result = execute(mutation, context: authenticated_user_context)

      assert_match "Error when publishing article to the EFCSN. Try again or contact administrator.",
                   result.data.publishEfcsnArticle.message
    end

    def expected_data
      {
        "externalId" => "random-external-ID",
        "dateCreated" => "2024-03-04T08:02:15.947Z",
        "dateModified" => "2024-03-04T08:02:15.947Z"
      }
    end
  end
end
