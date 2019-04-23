# frozen_string_literal: true

module Mutations
  class UpdatePage < GraphQL::Schema::Mutation
    description "Update existing page"

    field :page, Types::PageType, null: false

    argument :id, ID, required: true
    argument :page_input, Types::PageInputType, required: true

    def resolve(id:, page_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["pages:edit"])

      { page: Page.update(id, page_input.to_h) }
    end
  end
end
