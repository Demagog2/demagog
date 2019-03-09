# frozen_string_literal: true

module Types
  class StatementTranscriptPositionType < BaseObject
    field :id, ID, null: false
    field :start_line, Int, null: false
    field :start_offset, Int, null: false
    field :end_line, Int, null: false
    field :end_offset, Int, null: false
    field :source, Types::SourceType, null: false
    field :statement, Types::StatementType, null: false
  end
end
