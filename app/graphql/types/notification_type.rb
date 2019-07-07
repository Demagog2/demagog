# frozen_string_literal: true

module Types
  class NotificationType < BaseObject
    field :id, ID, null: false
    field :full_text, String, null: false
    field :statement_text, String, null: false
    field :statement, Types::StatementType, null: false
    field :recipient, Types::UserType, null: false
    field :created_at, Types::Scalars::DateTimeType, null: false
    field :read_at, Types::Scalars::DateTimeType, null: true
  end
end
