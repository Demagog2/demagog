# frozen_string_literal: true

Types::StatementTranscriptPositionType = GraphQL::ObjectType.define do
    name "StatementTranscriptPosition"

    field :id, !types.ID
    field :start_line, !types.Int
    field :start_offset, !types.Int
    field :end_line, !types.Int
    field :end_offset, !types.Int
    field :source, !Types::SourceType
    field :statement, !Types::StatementType
  end
