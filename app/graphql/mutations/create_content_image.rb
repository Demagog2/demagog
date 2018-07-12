# frozen_string_literal: true

Mutations::CreateContentImage = GraphQL::Field.define do
  name "CreateContentImage"
  type Types::ContentImageType
  description "Add new content image"

  argument :content_image_input, !Types::ContentImageInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["images:add"])

    ContentImage.create!(args[:content_image_input].to_h)
  }
end
