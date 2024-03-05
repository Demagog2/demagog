# frozen_string_literal: true

require "test_helper"

module Integrations::Efcsn
  class ApiClientTest < ActiveSupport::TestCase
    include Rails.application.routes.url_helpers

    def setup
      @article = create(:article)
    end

    test "creates payload with required fields" do
      assert_equal expected_request(@article), ApiClient.new(Faraday.new).build_request(@article)
    end

    test "sends POST request to create article API" do
      connection = Faraday.new do |builder|
        builder.adapter :test do |stub|
          stub.post("/articles", expected_request(@article).to_json) { [200, {}, mock_response.to_json] }
        end
      end

      efcsn_article = ApiClient.new(connection).post_article(@article)

      assert_equal mock_response["externalId"], efcsn_article.id
      assert_equal mock_response["dateCreated"].to_datetime, efcsn_article.created_at
      assert_equal mock_response["dateModified"].to_datetime, efcsn_article.updated_at
    end

    test "raises error on non 200 response" do
      connection = Faraday.new do |builder|
        builder.adapter :test do |stub|
          stub.post("/articles", expected_request(@article).to_json) { [400, {}, {}.to_json] }
        end
      end

      assert_raises(ApiClientError) do
        ApiClient.new(connection).post_article(@article)
      end
    end

    def expected_request(article)
      {
        type: "Debunk",
        url: article_url(article),
        headline: article.title_en,
        headlineNative: article.title,
        topics: ["Others"],
        countryOfOrigin: "CZ",
        contentLocation: "CZ"
      }
    end

    def mock_response
      {
        "externalId" => "random-external-ID",
        "dateCreated" => "2024-03-04T08:02:15.947Z",
        "dateModified" => "2024-03-04T08:02:15.947Z"
      }
    end
  end
end
