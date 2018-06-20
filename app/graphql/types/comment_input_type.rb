# frozen_string_literal: true

Types::CommentInputType = GraphQL::InputObjectType.define do
  name "CommentInputType"

  argument :content, !types.String
  argument :statement_id, !types.ID
  argument :user_id, !types.ID
end
