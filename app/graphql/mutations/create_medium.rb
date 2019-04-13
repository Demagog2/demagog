# frozen_string_literal: true

module Mutations
  class CreateMedium < GraphQL::Schema::Mutation
    description "Add new medium"

    field :medium, Types::MediumType, null: false

    argument :medium_input, Types::MediumInputType, required: true

    def resolve(medium_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      { medium: Medium.create_medium(medium_input.to_h) }
    end
  end
end
