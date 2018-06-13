# frozen_string_literal: true

Types::StatementTranscriptPositionInputType = GraphQL::InputObjectType.define do
  name "StatementTranscriptPositionInputType"

  argument :start_line, !types.Int
  argument :start_offset, !types.Int
  argument :end_line, !types.Int
  argument :end_offset, !types.Int
end
