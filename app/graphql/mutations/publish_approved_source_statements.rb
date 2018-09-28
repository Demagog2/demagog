# frozen_string_literal: true

Mutations::PublishApprovedSourceStatements = GraphQL::Field.define do
  name "PublishApprovedSourceStatements"
  type Types::SourceType
  description "Publish all approved statements from source"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["statements:edit"])

    source = Source.find(args[:id])
    source.publish_approved_statements
  }
end
