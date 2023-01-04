# frozen_string_literal: true

module Mutations
  class CreateComment < GraphQL::Schema::Mutation
    description "Add new comment"

    field :comment, Types::CommentType, null: false

    argument :comment_input, Types::CommentInputType, required: true

    def resolve(comment_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["statements:comments:add"])

      comment = Comment.create_comment(comment_input.to_h, context[:current_user])

      { comment: }
    end
  end
end
