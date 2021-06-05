# frozen_string_literal: true

module Mutations
  class UpdateWebContent < GraphQL::Schema::Mutation
    description "Update web content"

    field :web_content, Types::WebContentType, null: false

    argument :id, ID, required: true
    argument :web_content_input, Types::WebContentInputType, required: true

    def resolve(id:, web_content_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["web_contents:edit"])

      { web_content: WebContent.update(id, web_content_input.to_h) }
    end
  end
end
