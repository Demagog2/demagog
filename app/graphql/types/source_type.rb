# frozen_string_literal: true

module Types
  class StatementsCountsByEvaluationStatusItemType < BaseObject
    field :evaluation_status, String, null: false, hash_key: :evaluation_status
    field :statements_count, Int, null: false, hash_key: :statements_count
  end

  class SourceType < BaseObject
    field :id, ID, null: false
    # TODO: Make sure source name is internal
    field :name, String, null: false
    field :released_at, String, null: false
    field :source_url, String, null: true
    field :transcript, String, null: true
    field :medium, Types::MediumType, null: false
    field :media_personalities, [Types::MediaPersonalityType], null: false
    field :speakers, [Types::SpeakerType], null: false
    field :expert, Types::UserType, null: true

    field :statements, [Types::StatementType], null: false do
      argument :include_unpublished, Boolean, required: false, default_value: false
    end

    def statements(args)
      if args[:include_unpublished]
        # Public cannot access unpublished statements
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        statements = object.statements.ordered
      else
        statements = object.statements.published
      end

      statements
    end

    field :statements_counts_by_evaluation_status, StatementsCountsByEvaluationStatusItemType, null: false, resolve: ->(obj, args, ctx) {
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
