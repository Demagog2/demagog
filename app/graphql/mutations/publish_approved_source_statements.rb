# frozen_string_literal: true

module Mutations
  class PublishApprovedSourceStatements < GraphQL::Schema::Mutation
    description "Publish all approved statements from source"

    field :source, Types::SourceType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["statements:edit"])

      source = Source.find(id)
      source.publish_approved_statements

      { source: }
    end
  end
end
