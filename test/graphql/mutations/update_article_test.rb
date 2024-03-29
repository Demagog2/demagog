# frozen_string_literal: true

require "graphql/graphql_testcase"

class UpdateArticleMutationTest < GraphQLTestCase
  def mutation(article)
    "
      mutation {
        updateArticle(id: #{article.id}, articleInput: { articleType: \"default\", title: \"Breaking News\", titleEn: \"Breaking News in English\", perex: \"Lorem ipsum...\", segments: [] }) {
          article {
            title
            titleEn
          }
        }
      }
    "
  end

  test "should require authentication" do
    article = create(:fact_check)

    result = execute_with_errors(mutation(article))

    assert_auth_needed_error result
  end

  test "should update an article" do
    article = create(:fact_check)

    result = execute(mutation(article), context: authenticated_user_context)

    assert_equal "Breaking News", result.data.updateArticle.article.title
    assert_equal "Breaking News in English", result.data.updateArticle.article.titleEn
  end
end
