# frozen_string_literal: true

Mutations::CreateBody = GraphQL::Field.define do
  name "CreateBody"
  type Types::BodyType
  description "Add new body"

  argument :body_input, !Types::BodyInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Body.create!(args[:body_input].to_h)
  }
end
