# frozen_string_literal: true

module Types
  class CommentType < BaseObject
    field :id, ID, null: false
    field :content, String, null: false
    field :user, Types::UserType, null: false
    field :statement, Types::StatementType, null: false
    field :created_at, Types::Scalars::DateTimeType, null: false
  end
end
