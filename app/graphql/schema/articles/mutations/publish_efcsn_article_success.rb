# frozen_string_literal: true

module Schema::Articles::Mutations
  class PublishEfcsnArticleSuccess < Types::BaseObject
    field :article, Types::ArticleType, null: true
  end
end
