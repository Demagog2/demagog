# frozen_string_literal: true

Mutations::CreateMedium = GraphQL::Field.define do
  name "CreateMedium"
  type Types::MediumType
  description "Add new medium"

  argument :medium_input, !Types::MediumInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Medium.create_medium(args[:medium_input].to_h)
  }
end
