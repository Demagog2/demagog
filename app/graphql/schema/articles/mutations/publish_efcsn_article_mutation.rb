# frozen_string_literal: true

module Schema::Articles::Mutations
  class PublishEfcsnArticleMutation < GraphQL::Schema::RelayClassicMutation
    description "Publish article to the EFCSN database"

    argument :article_id, ID, required: true

    payload_type PublishEfcsnArticlePayload
    input_object_class Schema::Articles::Inputs::PublishEfcsnArticleInput

    def resolve(article_id:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      article = Article.find(article_id)

      service = Integrations::Efcsn::PublishArticleService.create

      result = service.publish_article(article, context[:current_user])

      case result
      in Integrations::Efcsn::PublishArticleService::NotAuthorized
        raise Errors::AuthenticationNeededError.new
      in Integrations::Efcsn::PublishArticleService::PublishingFailed
        { message: "Error when publishing article to the EFCSN. Try again or contact administrator." }
      else
        { article: result.article }
      end
    end
  end
end
