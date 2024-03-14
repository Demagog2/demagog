# frozen_string_literal: true

class DemagogSchema < GraphQL::Schema
  query Types::QueryType
  mutation Types::MutationType

  use GraphQL::Dataloader
end
