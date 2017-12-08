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

  field :party, Types::PartyType
end
