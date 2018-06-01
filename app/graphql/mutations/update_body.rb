# frozen_string_literal: true

Mutations::UpdateBody = GraphQL::Field.define do
  name "UpdateBody"
  type Types::BodyType
  description "Update existing body"

  argument :id, !types.Int
  argument :body_input, !Types::BodyInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Body.update(args[:id], args[:body_input].to_h)
  }
end
