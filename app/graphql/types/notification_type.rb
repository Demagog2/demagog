# frozen_string_literal: true

Types::NotificationType = GraphQL::ObjectType.define do
  name "Notification"

  field :id, !types.ID
  field :content, !types.String
  field :action_link, !types.String
  field :action_text, !types.String
  field :recipient, !Types::UserType
  field :created_at, !Types::Scalars::DateTimeType
  field :read_at, Types::Scalars::DateTimeType
end
