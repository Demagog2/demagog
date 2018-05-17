# frozen_string_literal: true

Types::BootstrapType = GraphQL::ObjectType.define do
  name "Bootstrap"

  field :image_server_url, !types.String
end
