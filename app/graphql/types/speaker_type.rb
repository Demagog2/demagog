# frozen_string_literal: true

Types::SpeakerType = GraphQL::ObjectType.define do
  name "Speaker"

  field :id, !types.ID
  field :before_name, !types.String
  field :first_name, !types.String
  field :last_name, !types.String
  field :after_name, !types.String
  field :bio, !types.String
  field :website_url, !types.String

  field :avatar, types.String do
    resolve -> (obj, args, ctx) do
      return nil unless obj.avatar.attached?

      Rails.application.routes.url_helpers.rails_blob_path(obj.avatar, only_path: true)
    end
  end

  field :statements, !types[Types::StatementType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0

    argument :veracity, Types::VeracityKeyType

    resolve ->(obj, args, ctx) {
      statements = obj.statements
        .published
        .limit(args[:limit])
        .offset(args[:offset])

      if args[:veracity]
        statements
          .joins(:assessments, :veracities)
          .where(
            assessments: {
              evaluation_status: Assessment::STATUS_CORRECT
            },
            veracities: {
              key: args[:veracity]
            }
          )
      else
        statements
      end
    }
  end

  field :memberships, !types[!Types::MembershipType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0

    resolve -> (obj, args, ctx) {
      obj.memberships
        .offset(args[:offset])
        .limit(args[:limit])
    }
  end

  field :body, Types::BodyType

  field :party, Types::PartyType do
    deprecation_reason "Replaced by 'body', as not all speakers must be members of a political party"

    resolve ->(obj, args, ctx) {
      obj.body
    }
  end

  field :stats, Types::StatsType do
    resolve ->(obj, args, ctx) {
      Stats::Speaker::StatsBuilderFactory.new.create(Settings).build(obj)
    }
  end
end
