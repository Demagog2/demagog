# frozen_string_literal: true

module Schema::Articles::Mutations
  class PublishEfcsnArticlePayload < GraphQL::Schema::Union
    possible_types PublishEfcsnArticleSuccess, PublishEfcsnArticleError

    def self.resolve_type(object, _ctx)
      if object.key?(:message)
        PublishEfcsnArticleError
      else
        PublishEfcsnArticleSuccess
      end
    end
  end
end
