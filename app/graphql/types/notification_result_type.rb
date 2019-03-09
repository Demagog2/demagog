# frozen_string_literal: true

class Types::NotificationsResult < Types::BaseObject
  field :total_count, !types.Int, hash_key: :total_count
  field :items, !types[!Types::NotificationType], hash_key: :items
end
