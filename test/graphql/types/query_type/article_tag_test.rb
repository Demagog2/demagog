# frozen_string_literal: true

require "graphql/graphql_testcase"

class QueryTypeArticleTagTest < GraphQLTestCase
  test "article tag should return given tag by id" do
    article_tag = create(:article_tag)

    query_string =
      "
      query {
        articleTag(id: #{
        article_tag.id
      }) {
          id
          title
        }
      }"

    result = execute(query_string)

    assert_equal article_tag.title, result.data.articleTag.title
  end

  test "article tag should return error if article is deleted" do
    article_tag = create(:article_tag)

    # soft delete article
    article_tag.destroy

    query_string =
      "
      query {
        articleTag(id: #{article_tag.id}) {
          id
          title
        }
      }"

    result = execute_with_errors(query_string)

    assert_graphql_error("Could not find ArticleTag with id=#{article_tag.id}", result)
  end
end
