# frozen_string_literal: true

module Integrations::Efcsn
  class ApiClient
    include Rails.application.routes.url_helpers

    def initialize(connection)
      @connection = connection
    end

    def post_article(article)
      response = @connection.post("articles", build_request(article).to_json)

      case response.status
      when 200
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
  end
end
