# frozen_string_literal: true

module Types
  class MediumInputType < GraphQL::Schema::InputObject
    argument :name, String, required: true
  end
end
