# frozen_string_literal: true

Types::ContentImageInputType = GraphQL::InputObjectType.define do
  name "ContentImageInputType"

  argument :user_id, !types.ID
end
