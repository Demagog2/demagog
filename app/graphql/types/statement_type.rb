# frozen_string_literal: true

Types::StatementType = GraphQL::ObjectType.define do
  name "Statement"

  field :id, !types.ID
  field :content, !types.String
  field :excerpted_at, !types.String
  field :important, !types.Boolean
  field :speaker, !Types::SpeakerType
  field :source, !Types::SourceType
  field :source_order, types.Int
  field :statement_transcript_position, Types::StatementTranscriptPositionType
  field :assessment, !Types::AssessmentType
  field :published, !types.Boolean

  field :comments, !types[!Types::CommentType] do
    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      obj.comments.ordered
    }
  end

  field :comments_count, !types.Int do
    resolve -> (obj, args, ctx) {
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      obj.comments.size
    }
  end
end
