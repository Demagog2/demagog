# frozen_string_literal: true

module Types
  class UserInputType < GraphQL::Schema::InputObject
    # Mandatory fields

    argument :email, String, required: true
    argument :active, Boolean, required: true
    argument :first_name, String, required: true
    argument :last_name, String, required: true
    argument :role_id, ID, required: true
    argument :email_notifications, Boolean, required: true

    # Optional fields

    argument :position_description, String, required: false
    argument :bio, String, required: false
    argument :phone, String, required: false
    argument :order, Int, required: false
    argument :rank, Int, required: false
  end
end
