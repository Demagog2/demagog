# frozen_string_literal: true

require "test_helper"

class SearchControllerTest < ActionDispatch::IntegrationTest
  MODELS = [Article, Page, Statement, Speaker, Body]

  teardown { elasticsearch_cleanup MODELS }

  test "should find speakers" do
    create(:speaker, first_name: "John", last_name: "Doe")
    create(:speaker, first_name: "Jane", last_name: "Doe")

    elasticsearch_index MODELS

    get search_path(q: "Doe")

    assert_response :success
    assert_select ".s-section-speakers", 1 do
      assert_select "h3"
      assert_select ".s-speaker", 2
      assert_select ".s-more", 0
    end
  end

  test "should render show more button if more than two politicians matches" do
    create_list(:speaker, 3, first_name: "John", last_name: "Doe")

    elasticsearch_index MODELS

    get search_path(q: "John")

    assert_response :success
    assert_select ".s-section-speakers", 1 do
      assert_select ".s-speaker", 2
      assert_select "a.s-more[href=?]", search_path(q: "John", type: "speakers")
    end
  end

  test "should not show speaker section if no speaker found" do
    elasticsearch_index MODELS

    get search_path(q: "Doe")

    assert_response :success
    assert_select ".s-section-speakers", 0
  end

  test "should find articles by title" do
    create(:fact_check, title: "Lorem ipsum sit dolor")

    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 1
    assert_select ".s-article", 1
  end

  test "should find articles by perex" do
    create(:fact_check, perex: "Lorem ipsum sit dolor")

    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 1
    assert_select ".s-article", 1
  end

  test "should find articles by segment text" do
    segment = create(:article_segment_text, text_html: "<p>Lorem ipsum sit dolor</p>")

    create(:static, segments: [segment])

    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 1
    assert_select ".s-article", 1
  end

  test "should not find unpublished articles" do
    create(:fact_check, title: "Lorem ipsum sit dolor", published: false)
    create(
      :fact_check,
      title: "Lorem ipsum sit dolor", published: true, published_at: 1.day.from_now
    )

    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 0
    assert_select ".s-article", 0
  end

  test "should sort articles by date published if the score is equal" do
    create(:fact_check, title: "Lorem ipsum sit dolor 1", created_at: 1.year.ago)
    create(:fact_check, title: "Lorem ipsum sit dolor 2", created_at: 1.second.ago)

    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 1 do
      assert_select ".s-article", 2 do |elements|
        TITLES = ["Lorem ipsum sit dolor 2", "Lorem ipsum sit dolor 1"]

        elements.each_with_index { |element, i| assert_select element, ".s-title", TITLES[i] }
      end
    end
  end

  test "should render show more button if more than two articles matches" do
    create_list(:fact_check, 3, title: "Lorem ipsum sit dolor")

    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 1 do
      assert_select ".s-article", 2
      assert_select "a.s-more[href=?]", search_path(q: "ipsum", type: "articles")
    end
  end

  test "should not show articles section if no articles found" do
    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-articles", 0
  end

  test "should find statements" do
    create(:statement, content: "Integer vulputate sem a nibh rutrum consequat.")
    create(:statement, content: "Integer vulputate sem a nibh rutrum consequat.")

    elasticsearch_index MODELS

    get search_path(q: "rutrum")

    assert_response :success
    assert_select ".s-section-statements", 1
    assert_select ".s-statement", 2
  end

  test "should find statements by assessment" do
    statement = create(:statement)
    statement.assessment.explanation_html = "<h1>Integer vulputate sem a nibh rutrum consequat.</h1>"
    statement.assessment.save!

    elasticsearch_index MODELS

    get search_path(q: "rutrum")

    assert_response :success
    assert_select ".s-section-statements", 1
    assert_select ".s-statement", 1
  end

  test "should not find unpublished statements" do
    create(:unpublished_statement, content: "Integer vulputate sem a nibh rutrum consequat.")

    elasticsearch_index MODELS

    get search_path(q: "rutrum")

    assert_response :success
    assert_select ".s-section-statements", 0
    assert_select ".s-statement", 0
  end

  test "should render show more button if more than two statements matches" do
    create_list(:statement, 3, content: "Integer vulputate sem a nibh rutrum consequat.")

    elasticsearch_index MODELS

    get search_path(q: "rutrum")

    assert_response :success
    assert_select ".s-section-statements", 1 do
      assert_select "h3"
      assert_select ".s-statement", 2
      assert_select "a.s-more[href=?]", search_path(q: "rutrum", type: "statements")
    end
  end

  test "should not show statements section if no statements found" do
    elasticsearch_index MODELS

    get search_path(q: "ipsum")

    assert_response :success
    assert_select ".s-section-statements", 0
  end

  test "SRP should have search field pre-filled with query" do
    elasticsearch_index MODELS

    get search_path(q: "My query")

    assert_response :success

    assert_select ".s-search-field", 1 do
      assert_select "[value=?]", "My query"
    end
  end

  test "should render paginated list of speakers" do
    create_list(:speaker, 12, first_name: "John", last_name: "Doe")

    elasticsearch_index MODELS

    get search_path(q: "Doe", type: "speakers")

    assert_response :success

    assert_select ".s-search-field", 1 do
      assert_select "[value=?]", "Doe"
    end
    assert_select "a.s-back-link[href=?]", search_path(q: "Doe")
    assert_select "h2"
    assert_select ".s-speaker", 10
  end

  test "should render paginated list of articles" do
    create_list(:fact_check, 12, title: "Lorem ipsum")

    elasticsearch_index MODELS

    get search_path(q: "lorem", type: "articles")

    assert_response :success

    assert_select ".s-search-field", 1 do
      assert_select "[value=?]", "lorem"
    end
    assert_select "a.s-back-link[href=?]", search_path(q: "lorem")
    assert_select "h2"
    assert_select ".s-article", 10
  end

  test "should not render paginated list of unpublished articles" do
    create_list(:fact_check, 4, title: "Lorem ipsum", published: false)
    create_list(:fact_check, 8, title: "Lorem ipsum")

    elasticsearch_index MODELS

    get search_path(q: "lorem", type: "articles")

    assert_response :success

    assert_select ".s-search-field", 1 do
      assert_select "[value=?]", "lorem"
    end
    assert_select "a.s-back-link[href=?]", search_path(q: "lorem")
    assert_select "h2"
    assert_select ".s-article", 8
  end

  test "should render paginated list of statements" do
    create_list(:statement, 12, content: "Integer vulputate sem a nibh rutrum consequat.")

    elasticsearch_index MODELS

    get search_path(q: "vulputate", type: "statements")

    assert_response :success

    assert_select ".s-search-field", 1 do
      assert_select "[value=?]", "vulputate"
    end
    assert_select "a.s-back-link[href=?]", search_path(q: "vulputate")
    assert_select "h2"
    assert_select ".s-statement", 10
  end

  test "should not render include unpublished statements" do
    create_list(:statement, 4, content: "Integer vulputate sem a nibh rutrum consequat.")
    create_list(
      :unpublished_statement,
      8,
      content: "Integer vulputate sem a nibh rutrum consequat."
    )

    elasticsearch_index MODELS

    get search_path(q: "vulputate", type: "statements")

    assert_response :success

    assert_select ".s-search-field", 1 do
      assert_select "[value=?]", "vulputate"
    end
    assert_select "a.s-back-link[href=?]", search_path(q: "vulputate")
    assert_select "h2"
    assert_select ".s-statement", 4
  end
end
