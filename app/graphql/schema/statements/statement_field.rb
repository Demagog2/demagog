# frozen_string_literal: true

module Schema::Statements::StatementField
  extend ActiveSupport::Concern

  included do
    field :statement, Types::StatementType, null: false do
      argument :id, GraphQL::Types::Int, required: true
      argument :include_unpublished, GraphQL::Types::Boolean, required: false, default_value: false
    end

    def statement(id:, include_unpublished: false)
      if include_unpublished
        # Public cannot access unpublished statements
        raise Errors::AuthenticationNeededError.new unless context[:current_user]

        return Statement.find(id)
      end

      Statement.published.find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError.new("Could not find Statement with id=#{id}")
    end
  end
end
