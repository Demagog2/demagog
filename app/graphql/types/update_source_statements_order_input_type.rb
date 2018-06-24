# frozen_string_literal: true

Types::UpdateSourceStatementsOrderInputType = GraphQL::InputObjectType.define do
  name "UpdateSourceStatementsOrderInputType"

  argument :ordered_statement_ids, types[!types.ID]
end
