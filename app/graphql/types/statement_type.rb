# frozen_string_literal: true

Types::StatementType = GraphQL::ObjectType.define do
  name "Statement"

  field :id, !types.ID
  field :content, !types.String
  field :excerpted_at, !types.String
  field :important, !types.Boolean
  field :speaker, !Types::SpeakerType
  field :statement_transcript_position, Types::StatementTranscriptPositionType
  field :assessment, Types::AssessmentType do
    resolve ->(obj, args, ctx) {
      obj.correct_assessment
    }
  end
end
