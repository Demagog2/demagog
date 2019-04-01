# frozen_string_literal: true

module Mutations
  class UpdateBody < GraphQL::Schema::Mutation
    description "Update existing body"

    field :body, Types::BodyType, null: false

    argument :id, Int, required: true
    argument :body_input, Types::BodyInputType, required: true

    def resolve(id:, body_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["bodies:edit"])

      { body: Body.update(id, body_input.to_h) }
    end
  end
end
