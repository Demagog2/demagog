# frozen_string_literal: true

Mutations::CreatePage = GraphQL::Field.define do
  name "CreatePage"
  type Types::PageType
  description "Add new page"

  argument :page_input, !Types::PageInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["pages:edit"])

    Page.create!(args[:page_input].to_h)
  }
end
