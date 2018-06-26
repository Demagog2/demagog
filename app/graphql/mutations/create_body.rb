# frozen_string_literal: true

Mutations::CreateBody = GraphQL::Field.define do
  name "CreateBody"
  type Types::BodyType
  description "Add new body"

  argument :body_input, !Types::BodyInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["bodies:edit"])

    Body.create!(args[:body_input].to_h)
  }
end
