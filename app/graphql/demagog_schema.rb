# frozen_string_literal: true

class DemagogSchema < GraphQL::Schema
  query Types::QueryType
  mutation Types::MutationType

  use GraphQL::Dataloader

  default_max_page_size 50
end
