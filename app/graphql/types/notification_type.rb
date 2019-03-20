# frozen_string_literal: true

module Types
  class NotificationType < BaseObject
    field :id, ID, null: false
    field :content, String, null: false
    field :action_link, String, null: false
    field :action_text, String, null: false
    field :recipient, Types::UserType, null: false
    field :created_at, Types::Scalars::DateTimeType, null: false
    field :read_at, Types::Scalars::DateTimeType, null: true
  end
end
