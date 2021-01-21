# frozen_string_literal: true

module Types
  class TagInputType < GraphQL::Schema::InputObject
    argument :name, String, required: true
    argument :for_statement_type, Types::StatementTypeType, required: true
  end
end
