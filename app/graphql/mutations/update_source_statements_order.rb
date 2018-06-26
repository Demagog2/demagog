# frozen_string_literal: true

Mutations::UpdateSourceStatementsOrder = GraphQL::Field.define do
  name "UpdateSourceStatementsOrder"
  type Types::SourceType
  description "Update order of statements in source"

  argument :id, !types.ID
  argument :input, !Types::UpdateSourceStatementsOrderInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["statements:sort"])

    source = Source.find(args[:id])
    source.update_statements_source_order(args[:input]["ordered_statement_ids"])
  }
end
