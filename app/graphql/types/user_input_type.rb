# frozen_string_literal: true

Types::UserInputType = GraphQL::InputObjectType.define do
  name "UserInputType"

  # Mandatory fields

  argument :email, !types.String
  argument :active, !types.Boolean
  argument :first_name, !types.String
  argument :last_name, !types.String
  argument :role_id, !types.ID
  argument :email_notifications, !types.Boolean

  # Optional fields

  argument :position_description, types.String
  argument :bio, types.String
  argument :phone, types.String
  argument :order, types.Int
  argument :rank, types.Int
end
