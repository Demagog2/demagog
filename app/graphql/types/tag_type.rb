# frozen_string_literal: true

module Types
  class TagType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :for_statement_type, Types::StatementTypeType, null: false
  end
end
