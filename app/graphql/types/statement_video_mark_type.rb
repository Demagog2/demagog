# frozen_string_literal: true

module Types
  class StatementVideoMarkType < BaseObject
    field :id, ID, null: false
    field :start, Int, null: false
    field :stop, Int, null: false
    field :source, Types::SourceType, null: false
    field :statement, Types::StatementType, null: false
  end
end
