# frozen_string_literal: true

Types::UpdateNotificationInputType = GraphQL::InputObjectType.define do
  name "UpdateNotificationInputType"

  argument :read_at, types.String
end
