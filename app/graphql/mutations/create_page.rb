# frozen_string_literal: true

module Mutations
  class CreatePage < GraphQL::Schema::Mutation
    description "Add new page"

    field :page, Types::PageType, null: false

    argument :page_input, Types::PageInputType, required: true

    def resolve(page_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["pages:edit"])

      { page: Page.create!(page_input.to_h) }
    end
  end
end
