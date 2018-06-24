# frozen_string_literal: true

Mutations::UpdateSourceStatementsOrder = GraphQL::Field.define do
  name "UpdateSourceStatementsOrder"
  type Types::SourceType
  description "Update order of statements in source"

  argument :id, !types.ID
  argument :input, !Types::UpdateSourceStatementsOrderInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    source = Source.find(args[:id])
    source.update_statements_source_order(args[:input]["ordered_statement_ids"])
  }
end
