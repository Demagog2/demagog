# frozen_string_literal: true

Types::UpdateUsersRankInputType = GraphQL::InputObjectType.define do
  name "UpdateUsersRankInputType"

  argument :ordered_user_ids, types[!types.ID]
end
