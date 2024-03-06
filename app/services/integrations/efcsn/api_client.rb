# frozen_string_literal: true

module Integrations::Efcsn
  class ApiClient
    include Rails.application.routes.url_helpers

    def initialize(connection)
      @connection = connection
    end

    def post_article(article)
      response = @connection.post("articles") do |req|
        req.headers[:content_type] = "application/json"
        req.body = JSON.generate(build_request(article))
      end

      case response.status
      when 200, 201
        article_raw = JSON.parse(response.body)

        EfcsnArticle.new(
          id: article_raw["externalId"],
          created_at: article_raw["dateCreated"].to_datetime,
          updated_at: article_raw["dateModified"].to_datetime,
        )
      else
        raise ApiClientError.new("Efcsn api error", response.status, response.body)
      end
    end

    def build_request(article)
      request = {
        type: "Narrative",
        url: article_url(article),
        headline: article.title_en,
        headlineNative: article.title,
        topics: ["Others"],
        countryOfOrigin: "CZ",
        contentLocation: ["CZ"]
      }

      if article.illustration.attached?
        request[:image] = rails_representation_url(article.illustration.variant(:medium).processed)
      end

      request
    end
  end
end
