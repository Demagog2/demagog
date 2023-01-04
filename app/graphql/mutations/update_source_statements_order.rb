# frozen_string_literal: true

module Mutations
  class UpdateSourceStatementsOrder < GraphQL::Schema::Mutation
    description "Update order of statements in source"

    field :source, Types::SourceType, null: false

    argument :id, ID, required: true
    argument :input, Types::UpdateSourceStatementsOrderInputType, required: true

    def resolve(id:, input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["statements:sort"])

      source = Source.find(id)
      source.update_statements_source_order(input[:ordered_statement_ids])

      { source: }
    end
  end
end
