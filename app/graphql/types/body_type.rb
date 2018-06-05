# frozen_string_literal: true

Types::BodyType = GraphQL::ObjectType.define do
  name "Body"

  field :id, !types.ID
  field :name, !types.String
  field :short_name, types.String
  field :is_party, !types.Boolean do
    resolve -> (obj, args, ctx) do
      obj.is_party.nil? || obj.is_party == true
    end
  end
  field :is_inactive, !types.Boolean
  field :link, types.String

  field :founded_at, types.String
  field :terminated_at, types.String

  field :members, !types[Types::SpeakerType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0

    resolve ->(obj, args, ctx) {
      obj.current_members.limit(args[:limit]).offset(args[:offset])
    }
  end

  field :logo, types.String do
    resolve -> (obj, args, ctx) do
      return nil unless obj.logo.attached?

      Rails.application.routes.url_helpers.rails_blob_path(obj.logo, only_path: true)
    end
  end

  field :legacy_logo, types.String do
    deprecation_reason "Logo url from legacy demagog"

    resolve -> (obj, args, ctx) do
      return nil if obj.attachment.nil?

      return nil if obj.attachment.file.empty?

      Class.new.extend(ApplicationHelper).body_logo(obj.attachment)
    end
  end
end
