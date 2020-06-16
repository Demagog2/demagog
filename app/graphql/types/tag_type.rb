# frozen_string_literal: true

module Types
  class TagType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :for_statement_type, Types::StatementTypeType, null: false
    field :published_statements_count, Int, null: false
    field :all_statements_count, Int, null: false

    def all_statements_count
      # Includes also non-published statements, so we don't want to leak such numbers
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      object.all_statements_count
    end
  end
end
