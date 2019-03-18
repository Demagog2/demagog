# frozen_string_literal: true

Types::SourceType = GraphQL::ObjectType.define do
  name "Source"

  field :id, !types.ID
  field :released_at, !types.String
  field :source_url, types.String
  field :transcript, types.String
  field :medium, !Types::MediumType
  field :media_personalities, !types[!Types::MediaPersonalityType]
  field :speakers, !types[!Types::SpeakerType]
  field :expert, Types::UserType

  field :name, !types.String do
    resolve ->(obj, args, ctx) {
      # Source name is internal
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      obj.name
    }
  end

  field :statements, !types[!Types::StatementType] do
    argument :include_unpublished, types.Boolean, default_value: false

    resolve ->(obj, args, ctx) {
      if args[:include_unpublished]
        # Public cannot access unpublished statements
        raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

        statements = obj.statements.ordered
      else
        statements = obj.statements.published
      end

      statements
    }
  end

  StatementsCountsByEvaluationStatusItemType = GraphQL::ObjectType.define do
    name "StatementsCountsByEvaluationStatusItemType"

    field :evaluation_status, !types.String, hash_key: :evaluation_status
    field :statements_count, !types.Int, hash_key: :statements_count
  end

  field :statements_counts_by_evaluation_status, !types[!StatementsCountsByEvaluationStatusItemType] do
    resolve ->(obj, args, ctx) {
      grouped = obj.statements.includes(:assessment).group_by do |statement|
        statement.assessment.evaluation_status
      end

      grouped.keys.map do |evaluation_status|
        {
          evaluation_status: evaluation_status,
          statements_count: grouped[evaluation_status].size
        }
      end
    }
  end
end
