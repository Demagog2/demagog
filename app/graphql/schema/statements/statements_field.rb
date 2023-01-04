# frozen_string_literal: true

module Schema::Statements::StatementsField
  extend ActiveSupport::Concern

  included do
    field :statements, [Types::StatementType], null: false do
      argument :limit, GraphQL::Types::Int, required: false, default_value: 10
      argument :offset, GraphQL::Types::Int, required: false, default_value: 0
      argument :source, GraphQL::Types::Int, required: false
      argument :speaker, GraphQL::Types::Int, required: false
      argument :veracity, Types::VeracityKeyType, required: false
      argument :include_unpublished, GraphQL::Types::Boolean, required: false, default_value: false
      argument :evaluated_by_user_id, GraphQL::Types::ID, required: false
      argument :sort_sources_in_reverse_chronological_order, GraphQL::Types::Boolean, required: false, default_value: false
    end

    def statements(offset:, limit:, source: nil, include_unpublished: false, speaker: nil, veracity: nil, evaluated_by_user_id: nil, sort_sources_in_reverse_chronological_order: false)
      if include_unpublished
        # Public cannot access unpublished statements
        Utils::Auth.authenticate(context)

        statements = Statement.ordered
      else
        statements = Statement.published
      end

      statements = statements.offset(offset).limit(limit)

      statements = statements.where(source:) if source
      statements = statements.joins(:source_speaker).where(source_speaker: { speaker: }) if speaker
      statements = statements.joins(:veracity).where(veracities: { key: veracity }) if veracity

      if evaluated_by_user_id
        # Public cannot filter by evaluator
        Utils::Auth.authenticate(context)

        statements = statements.joins(:assessment).where(assessments: { user_id: evaluated_by_user_id })
      end

      # Include these basics as they are part of most of queries for statements
      # and seriously speed those queries
      #
      # TODO: When we have graphql-ruby 1.9+, lets use lookaheads for smart includes.
      # See https://graphql-ruby.org/queries/lookahead.html
      statements =
        statements.includes({ assessment: :veracity }, { speaker: :body }, { source: :medium })

      statements = Statement.sort_statements_query(statements.reorder(""), false) if sort_sources_in_reverse_chronological_order

      statements
    end
  end
end
