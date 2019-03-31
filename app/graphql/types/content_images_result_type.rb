# frozen_string_literal: true

module Types
  class ContentImagesResultType < BaseObject
    field :total_count, Int, hash_key: :total_count, null: false
    field :items, [Types::ContentImageType], hash_key: :items, null: false
  end
end
