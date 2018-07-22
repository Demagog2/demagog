# frozen_string_literal: true

Mutations::CreateComment = GraphQL::Field.define do
  name "CreateComment"
  type Types::CommentType
  description "Add new comment"

  argument :comment_input, !Types::CommentInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["statements:comments:add"])

    Comment.create_comment(args[:comment_input].to_h, ctx[:current_user])

    # comment_input = args[:comment_input].to_h
    # comment_input["user"] = ctx[:current_user]

    # Comment.create!(comment_input, ct)
  }
end
