# frozen_string_literal: true

module Mutations
  class CreateTag < GraphQL::Schema::Mutation
    description "Add new tag"

    field :tag, Types::TagType, null: false

    argument :tag_input, Types::TagInputType, required: true

    def resolve(tag_input:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      tag = Tag.create(tag_input.to_h)

      { tag: tag }
    end
  end
end
