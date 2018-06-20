# frozen_string_literal: true

Mutations::CreateComment = GraphQL::Field.define do
  name "CreateComment"
  type Types::CommentType
  description "Add new comment"

  argument :comment_input, !Types::CommentInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    comment_input = args[:comment_input].to_h
    comment_input["user"] = ctx[:current_user]

    Comment.create!(comment_input)
  }
end
