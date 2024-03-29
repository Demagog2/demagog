# frozen_string_literal: true

module Schema::Sources::SourcesField
  extend ActiveSupport::Concern

  included do
    field :sources, [Types::SourceType], null: false do
      argument :limit, GraphQL::Types::Int, required: false, default_value: 10
      argument :offset, GraphQL::Types::Int, required: false, default_value: 0
      argument :name, GraphQL::Types::String, required: false
      argument :include_ones_without_published_statements,
               GraphQL::Types::Boolean,
               default_value: false, required: false
    end

    def sources(offset:, limit:, name: nil, include_ones_without_published_statements: false)
      sources =
        Source.includes(:medium, :media_personalities).order(released_at: :desc).offset(offset)
              .limit(limit)

      if name.present?
        # Source name is internal
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        sources = sources.matching_name(name)
      end

      if include_ones_without_published_statements
        # Public cannot access sources without published statements
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        return sources
      end

      sources.select { |source| source.statements.published.count > 0 }
    end
  end
end
