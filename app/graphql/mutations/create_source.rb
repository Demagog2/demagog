# frozen_string_literal: true

Mutations::CreateSource = GraphQL::Field.define do
  name "CreateSource"
  type Types::SourceType
  description "Add new source"

  argument :source_input, !Types::SourceInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    Source.create!(args[:source_input].to_h)
  }
end
