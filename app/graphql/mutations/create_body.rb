# frozen_string_literal: true

module Mutations
  class CreateBody < GraphQL::Schema::Mutation
    description "Create new body"

    field :body, Types::BodyType, null: false

    argument :body_input, Types::BodyInputType, required: true

    def resolve(body_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["bodies:edit"])

      { body: Body.create!(body_input.to_h) }
    end
  end
end
