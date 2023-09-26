# frozen_string_literal: true

module Schema::Articles::ArticleTagField
  extend ActiveSupport::Concern

  included do
    field :article_tag, Types::ArticleTagType, null: false do
      argument :id, GraphQL::Types::ID, required: true
    end

    def article_tag(id:)
      ArticleTag.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find ArticleTag with id=#{id}")
    end
  end
end
