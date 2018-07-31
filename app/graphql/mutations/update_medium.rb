# frozen_string_literal: true

Mutations::UpdateMedium = GraphQL::Field.define do
  name "UpdateMedium"
  type Types::MediumType
  description "Update existing medium"

  argument :id, !types.ID
  argument :medium_input, !Types::MediumInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Medium.update_medium(args[:id], args[:medium_input].to_h)
  }
end
