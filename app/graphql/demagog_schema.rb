# frozen_string_literal: true

DemagogSchema = GraphQL::Schema.define do
  query(Types::QueryType)
  mutation(Types::MutationType)
end
