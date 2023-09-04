# frozen_string_literal: true

module Mutations
  class DeleteArticleTag < GraphQL::Schema::Mutation
    description "Delete existing article tag"

    field :id, ID, null: true

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["users:edit"])

      id = id.to_i

      begin
        ArticleTag.delete_article_tag(id)
        { id: }

      rescue ActiveRecord::RecordNotFound, ActiveModel::ValidationError => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
