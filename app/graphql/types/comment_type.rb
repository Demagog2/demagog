# frozen_string_literal: true

Types::CommentType = GraphQL::ObjectType.define do
  name "Comment"

  field :id, !types.ID
  field :content, !types.String
  field :user, !Types::UserType
  field :statement, !Types::StatementType
  field :created_at, !Types::Scalars::DateTimeType
end
