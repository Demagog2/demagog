# frozen_string_literal: true

module Types
  class BodyType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :short_name, String, null: true
    field :short_name, String, null: true, camelize: false, deprecation_reason: "switch to camelCase version"
    field :display_name, String, null: false
    field :is_party, Boolean, null: false

    def is_party
      object.is_party.nil? || object.is_party == true
    end

    field :is_inactive, Boolean, null: false
    field :link, String, null: true

    field :founded_at, String, null: true
    field :terminated_at, String, null: true

    field :members, [Types::SpeakerType], null: false do
      argument :limit, Int, default_value: 10, required: false
      argument :offset, Int, default_value: 0, required: false
    end

    def members(args)
      object.current_members.limit(args[:limit]).offset(args[:offset])
    end

    field :logo, String, null: true

    def logo
      return nil unless object.logo.attached?

      Rails.application.routes.url_helpers.polymorphic_url(object.logo, only_path: true)
    end

    field :legacy_logo, String, null: true,
          deprecation_reason: "Logo url from legacy demagog"

    def legacy_logo
      return nil if object.attachment.nil?

      return nil if object.attachment.file.empty?

      Class.new.extend(ApplicationHelper).body_logo(object.attachment)
    end
  end
end
