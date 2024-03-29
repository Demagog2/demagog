# frozen_string_literal: true

module Types
  class StatementsCountsByEvaluationStatusItemType < BaseObject
    field :evaluation_status, String, null: false, hash_key: :evaluation_status
    field :statements_count, Int, null: false, hash_key: :statements_count
  end

  class SourceType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :released_at, String, null: true
    field :source_url, String, null: true
    field :transcript, String, null: true
    field :medium, Types::MediumType, null: true
    field :media_personalities, [Types::MediaPersonalityType], null: true
    field :source_speakers, [Types::SourceSpeakerType], null: true
    field :experts, [Types::UserType], null: true
    field :video_type, String, null: true
    field :video_id, String, null: true
    field :internal_stats, GraphQL::Types::JSON, null: false

    def transcript
      # Transcript is mostly from Newton Media and cannot be offered publicly
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      object.transcript
    end

    field :statements, [Types::StatementType], null: false do
      argument :include_unpublished, Boolean, required: false, default_value: false
    end

    def name
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      object.name
    end

    def experts
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      object.experts
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

    field :statements_counts_by_evaluation_status, [StatementsCountsByEvaluationStatusItemType], null: false

    def statements_counts_by_evaluation_status
      grouped = object.statements.includes(:assessment).group_by do |statement|
        statement.assessment.evaluation_status
      end

      grouped.keys.map do |evaluation_status|
        {
          evaluation_status:,
          statements_count: grouped[evaluation_status].size
        }
      end
    end

    def internal_stats
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      object.internal_stats
    end
  end
end
