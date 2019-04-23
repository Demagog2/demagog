# frozen_string_literal: true

module Types
  class UpdateNotificationInputType < GraphQL::Schema::InputObject
    argument :read_at, String, required: false
  end
end
