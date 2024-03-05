# frozen_string_literal: true

module Schema::Articles::Inputs
  class PublishEfcsnArticleInput < GraphQL::Schema::InputObject
    argument :article_id, ID, required: true
  end
end
