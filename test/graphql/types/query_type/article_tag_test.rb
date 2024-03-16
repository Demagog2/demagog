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

  test "article tag should return given tag by slug" do
    article = create(:article)
    article_tag = create(:article_tag, published: true)
    article_tag.articles << article

    query_string = <<~GRAPHQL
      query {
        articleTagBySlug(slug: "#{article_tag.slug}") {
          title
          articles {
            title
          }
          articlesV2 {
            nodes {
              title
            }
          }
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_equal article_tag.title, result.data.articleTagBySlug.title
    assert_equal article.title, result.data.articleTagBySlug.articlesV2.nodes.first.title
  end

  test "article tag should not return unpublished tag by slug" do
    article_tag = create(:article_tag, published: false)

    query_string = <<~GRAPHQL
      query {
        articleTagBySlug(slug: "#{article_tag.slug}") {
          title
        }
      }
    GRAPHQL

    result = execute(query_string)

    assert_nil result.data.articleTagBySlug
  end
end
