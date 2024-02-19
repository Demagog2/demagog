# frozen_string_literal: true

module Types
  class UserType < BaseObject
    field :id, ID, null: false

    field :first_name, String, null: false
    field :last_name, String, null: false
    field :email, String, null: false
    field :phone, String, null: true
    field :bio, String, null: true
    field :position_description, String, null: true

    field :order, Int, null: true
    field :active, Boolean, null: false
    field :rank, Int, null: true
    field :role, Types::RoleType, null: false
    field :email_notifications, Boolean, null: false
    field :user_public, Boolean, null: false

    field :created_at, String, null: false
    field :updated_at, String, null: true

    field :avatar, String, null: true

    field :government_promises_evaluations_enabled, Boolean, null: false

    def avatar
      return nil unless object.avatar.attached?

      Rails.application.routes.url_helpers.polymorphic_url(object.avatar, only_path: true)
    end

    def government_promises_evaluations_enabled
      Flipper.enabled?("government_promises_evaluations", object)
    end
  end
end
