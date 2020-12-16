# frozen_string_literal: true

module Types
  class SpeakerType < BaseObject
    field :id, ID, null: false
    field :osoba_id, String, null: true, description: "Temporary IDs from Hlidac statu, please use Wikidata ID instead"
    field :wikidata_id, String, null: true
    field :before_name, String, null: false
    field :first_name, String, null: false
    field :first_name, String, null: false, camelize: false, deprecation_reason: "switch to camelCase version"
    field :last_name, String, null: false
    field :last_name, String, null: false, camelize: false, deprecation_reason: "switch to camelCase version"
    field :after_name, String, null: false
    field :bio, String, null: false
    field :website_url, String, null: false

    field :avatar, String, null: true

    def avatar
      return nil unless object.avatar.attached?

      Rails.application.routes.url_helpers.polymorphic_url(object.avatar, only_path: true)
    end

    # Seznam uses portrait of speaker, we need to keep it till they update it
    field :portrait, String, null: true,
          deprecation_reason: "Replaced by 'body', as not all speakers must be members of a political party"

    def portrait
      return nil unless object.avatar.attached?

      Rails.application.routes.url_helpers.polymorphic_url(object.avatar, only_path: true)
    end

    field :statements, [Types::StatementType], null: false do
      argument :limit, Int, default_value: 10, required: false
      argument :offset, Int, default_value: 0, required: false

      argument :veracity, Types::VeracityKeyType, required: false
    end

    def statements(args)
      statements = object.statements
                     .published
                     .limit(args[:limit])
                     .offset(args[:offset])

      if args[:veracity]
        statements
          .joins(:assessment, :veracity)
          .where(
            assessments: {
              evaluation_status: Assessment::STATUS_APPROVED
            },
            veracities: {
              key: args[:veracity]
            }
          )
      else
        statements
      end
    end

    field :memberships, [Types::MembershipType], null: true do
      argument :limit, Int, default_value: 10, required: false
      argument :offset, Int, default_value: 0, required: false
    end

    def memberships(args)
      object.memberships
        .offset(args[:offset])
        .limit(args[:limit])
    end

    field :body, Types::BodyType, null: true

    field :party, Types::PartyType, null: true,
          deprecation_reason: "Replaced by 'body', as not all speakers must be members of a political party"

    def party
      object.body
    end

    field :stats, Types::StatsType, null: true

    def stats
      SpeakerStat.where(speaker_id: object.id).normalize
    end
  end
end
