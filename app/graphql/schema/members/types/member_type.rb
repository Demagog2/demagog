# frozen_string_literal: true

module Schema::Members::Types
  class MemberType < Types::BaseObject
    field :id, ID, null: false
    field :full_name, String, null: false
    field :position_description, String, null: true
    field :bio, String, null: true
    field :avatar, String, null: true

    def avatar(size: nil)
      return nil unless object.avatar.attached?

      Rails.application.routes.url_helpers.rails_representation_url(object.avatar.variant(:thumbnail).processed, only_path: true)
    end
  end
end
