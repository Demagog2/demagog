# frozen_string_literal: true

module Types
  class MediaPersonalityInputType < GraphQL::Schema::InputObject
    argument :name, String, required: true
  end
end
