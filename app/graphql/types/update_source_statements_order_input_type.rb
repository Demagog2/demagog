# frozen_string_literal: true

module Types
  class UpdateSourceStatementsOrderInputType < GraphQL::Schema::InputObject
    argument :ordered_statement_ids, [ID], required: true
  end
end
