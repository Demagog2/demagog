# frozen_string_literal: true

Types::UserType = GraphQL::ObjectType.define do
  name "User"

  field :id, !types.ID

  field :first_name, !types.String
  field :last_name, !types.String
  field :email, !types.String
  field :phone, types.String
  field :bio, types.String
  field :position_description, types.String

  field :order, types.Int
  field :active, !types.Boolean
  field :rank, types.Int
  field :role, !Types::RoleType
  field :email_notifications, !types.Boolean
  field :user_public, !types.Boolean

  field :created_at, !types.String
  field :updated_at, types.String

  field :avatar, types.String do
    resolve -> (obj, args, ctx) do
      return nil unless obj.avatar.attached?

      Rails.application.routes.url_helpers.polymorphic_url(obj.avatar, only_path: true)
    end
  end
end
