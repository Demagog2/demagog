# frozen_string_literal: true

Types::UserType = GraphQL::ObjectType.define do
  name "User"

  field :id, !types.ID

  field :first_name, !types.String
  field :last_name, !types.String
  field :email, !types.String
  field :phone, !types.String
  field :bio, !types.String
  field :position_description, !types.String

  field :order, !types.Int
  field :active, !types.Boolean
  field :rang, !types.Int

  field :created_at, !types.String
  field :updated_at, !types.String

  field :avatar, types.String do
    resolve -> (obj, args, ctx) do
      return nil unless obj.avatar.attached?

      Rails.application.routes.url_helpers.rails_blob_path(obj.avatar, only_path: true)
    end
  end
end
