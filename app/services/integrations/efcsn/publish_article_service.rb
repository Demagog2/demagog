# frozen_string_literal: true

module Integrations::Efcsn
  class PublishArticleService
    NotAuthorized = Struct.new(:message)
    PublishingFailed = Struct.new(:message)
    PublishingSuccess = Struct.new(:article)

    def initialize(api_client, logger = Rails.logger)
      @api_client = api_client
      @logger = logger
    end

    def publish_article(article, current_user)
      @logger.info("service=efcsn_publish_article action=publish_article user_id=#{current_user.id} article_id=#{article.id} step=started")

      if ArticleAbility.new(current_user).cannot?(:publish_efcsn_article, article)
        @logger.error("service=efcsn_publish_article action=publish_article user_id=#{current_user.id} article_id=#{article.id} step=not_authorized")

        return NotAuthorized.new("User '#{current_user.full_name}' with id '#{current_user.id}' is not allowed to publish an EFCSN article.")
      end

      created_article = @api_client.post_article(article)

      article.update!(
        efcsn_external_id: created_article.id,
        efcsn_created_at: created_article.created_at,
        efcsn_updated_at: created_article.updated_at,
      )

      @logger.info("service=efcsn_publish_article action=publish_article user_id=#{current_user.id} article_id=#{article.id} efcsn_article_id=#{created_article.id} step=finished")

      PublishingSuccess.new(article)
    rescue => e
      @logger.error("service=efcsn_publish_article action=publish_article user_id=#{current_user.id} article_id=#{article.id} step=error message=#{e.message}")

      PublishingFailed.new("Publishing failed because of #{e.message}")
    end

    # TODO: Move to the ApiClient or create factory
    def self.create
      options = {
        url: ENV.fetch("EFCSN_SERVICE_URL"),
        headers: {
          "X-DOMAIN" => "demagog.cz",
          "X-API-KEY" => ENV.fetch("EFCSN_API_KEY")
        }
      }

      client = ApiClient.new(Faraday.new(options))

      new(client)
    end
  end
end
