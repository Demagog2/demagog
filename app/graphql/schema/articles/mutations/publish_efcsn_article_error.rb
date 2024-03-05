# frozen_string_literal: true

module Schema::Articles::Mutations
  class PublishEfcsnArticleError < Types::BaseObject
    field :message, String, null: false
  end
end
