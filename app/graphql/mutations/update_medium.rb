# frozen_string_literal: true
# frozen_string_literal: true

module Mutations
  class UpdateMedium < GraphQL::Schema::Mutation
    description "Update existing medium"

    field :medium, Types::MediumType, null: false

    argument :id, ID, required: true
    argument :medium_input, Types::MediumInputType, required: true

    def resolve(id:, medium_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      { medium: Medium.update_medium(id, medium_input.to_h) }
    end
  end
end
