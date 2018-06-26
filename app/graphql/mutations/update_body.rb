# frozen_string_literal: true

Mutations::UpdateBody = GraphQL::Field.define do
  name "UpdateBody"
  type Types::BodyType
  description "Update existing body"

  argument :id, !types.Int
  argument :body_input, !Types::BodyInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["bodies:edit"])

    Body.update(args[:id], args[:body_input].to_h)
  }
end
