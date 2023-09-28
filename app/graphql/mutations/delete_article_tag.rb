# frozen_string_literal: true

module Mutations
  class DeleteArticleTag < BaseMutation
    description "Delete existing article tag"

    field :id, ID, null: true

    argument :id, ID, required: true

    def resolve(id:)
      authorize!(:delete, ArticleTag)

      id = id.to_i

      ArticleTag.destroy(id)
      { id: }
    rescue CanCan::AccessDenied
      raise Errors::AuthenticationNeededError.new

    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  end
end
