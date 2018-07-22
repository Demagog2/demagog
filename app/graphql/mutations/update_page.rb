# frozen_string_literal: true

Mutations::UpdatePage = GraphQL::Field.define do
  name "UpdatePage"
  type Types::PageType
  description "Update existing page"

  argument :id, !types.ID
  argument :page_input, !Types::PageInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["pages:edit"])

    Page.update(args[:id], args[:page_input].to_h)
  }
end
