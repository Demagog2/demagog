# frozen_string_literal: true

Types::StatementInputType = GraphQL::InputObjectType.define do
  name "StatementInputType"

  argument :content, !types.String
  argument :excerpted_at, !types.String
  argument :important, !types.Boolean
  argument :speaker_id, !types.ID
  argument :source_id, !types.ID
  argument :published, !types.Boolean
  argument :count_in_statistics, !types.Boolean
  argument :statement_transcript_position, Types::StatementTranscriptPositionInputType
end
