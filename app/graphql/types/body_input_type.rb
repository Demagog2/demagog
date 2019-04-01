# frozen_string_literal: true

module Types
  class BodyInputType < GraphQL::Schema::InputObject
    argument :name, String, required: true
    argument :is_party, Boolean, required: true
    argument :is_inactive, Boolean, required: true

    argument :short_name, String, required: false
    argument :link, String, required: false

    argument :founded_at, String, required: false
    argument :terminated_at, String, required: false
  end
end
