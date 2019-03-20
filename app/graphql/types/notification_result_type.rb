# frozen_string_literal: true

module Types
  class NotificationsResult < BaseObject
    field :total_count, Int, null: false, hash_key: :total_count
    field :items, [Types::NotificationType], null: false, hash_key: :items
  end
end
