# frozen_string_literal: true

Types::ContentImageType = GraphQL::ObjectType.define do
  name "ContentImage"

  field :id, !types.ID
  field :name, !types.String
  field :created_at, !Types::Scalars::DateTimeType
  field :user, Types::UserType

  field :image, !types.String do
    resolve -> (obj, args, ctx) do
      Rails.application.routes.url_helpers.polymorphic_url(obj.image, only_path: true)
    end
  end

  field :image_50x50, !types.String do
    resolve -> (obj, args, ctx) do
      Rails.application.routes.url_helpers.polymorphic_url(
        obj.image.variant(resize: "50x50"),
        only_path: true
      )
    end
  end
end
