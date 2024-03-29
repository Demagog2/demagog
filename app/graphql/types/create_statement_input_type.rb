# frozen_string_literal: true

module Types
  class CreateStatementInputType < GraphQL::Schema::InputObject
    argument :statement_type, Types::StatementTypeType, required: true
    argument :content, String, required: true
    argument :excerpted_at, String, required: true
    argument :important, Boolean, required: true
    argument :source_speaker_id, ID, required: true
    argument :source_id, ID, required: true
    argument :published, Boolean, required: true
    argument :assessment, CreateAssessmentInputType, required: true
    argument :statement_transcript_position, StatementTranscriptPositionInputType, required: false
    argument :statement_video_mark, StatementVideoMarkInputType, required: false
    argument :first_comment_content, String, required: false
  end
end
