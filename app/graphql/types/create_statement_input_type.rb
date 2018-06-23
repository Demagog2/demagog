# frozen_string_literal: true

Types::CreateStatementInputType = GraphQL::InputObjectType.define do
  name "CreateStatementInputType"

  argument :content, !types.String
  argument :excerpted_at, !types.String
  argument :important, !types.Boolean
  argument :speaker_id, !types.ID
  argument :source_id, !types.ID
  argument :published, !types.Boolean
  argument :count_in_statistics, !types.Boolean
  argument :assessment, !Types::CreateAssessmentInputType
  argument :statement_transcript_position, Types::StatementTranscriptPositionInputType
  argument :first_comment_content, types.String
end
