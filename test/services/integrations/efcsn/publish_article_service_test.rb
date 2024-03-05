# frozen_string_literal: true

require "test_helper"
require "minitest/mock"

module Integrations
  module Efcsn
    class PublishArticleServiceTest < ActiveSupport::TestCase
      def setup
        @article = create(:article)
        @user = create(:user, :expert)
      end

      test "fails for anyone but expert and admin" do
        roles = [
          :intern,
          :proofreader,
          :social_media_manager,
        ]

        roles.each do |role|
          user = create(:user, role)

          api_client = Minitest::Mock.new
          logger = Minitest::Mock.new
          def logger.info(_msg); end
          logger.expect :error, nil do |log_message|
            assert_match(/step=not_authorized/, log_message)
          end

          result = PublishArticleService.new(api_client, logger).publish_article(@article, user)

          assert_equal result.message, "User '#{user.full_name}' with id '#{user.id}' is not allowed to publish an EFCSN article."

          assert_mock logger
        end
      end

      test "returns success with updated article" do
        api_client = Minitest::Mock.new
        api_client.expect :post_article, created_efcsn_article, [@article]

        result = PublishArticleService.new(api_client).publish_article(@article, @user)

        assert_instance_of PublishArticleService::PublishingSuccess, result

        assert_equal created_efcsn_article.id, result.article.efcsn_external_id
        assert_equal created_efcsn_article.created_at, result.article.efcsn_created_at
        assert_equal created_efcsn_article.updated_at, result.article.efcsn_updated_at

        assert_mock api_client
      end

      test "returns message in case of a failure" do
        api_client = Minitest::Mock.new
        api_client.expect(:post_article, nil) do
          raise "Don't know what's going on!"
        end

        result = PublishArticleService.new(api_client).publish_article(@article, @user)
        assert_match "Don't know what's going on!", result.message

        assert_mock api_client
      end

      def created_efcsn_article
        EfcsnArticle.new(
          id: "random-external-ID",
          created_at: "2024-03-04T08:02:15.947Z".to_datetime,
          updated_at: "2024-03-04T08:02:15.947Z".to_datetime,
        )
      end
    end
  end
end
