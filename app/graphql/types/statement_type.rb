# frozen_string_literal: true

module Types
  class StatementType < BaseObject
    field :id, ID, null: false
    field :statement_type, Types::StatementTypeType, null: false
    field :content, String, null: false
    field :title, String, null: true
    field :excerpted_at, String, null: false
    field :important, Boolean, null: false
    field :speaker, Types::SpeakerType, null: false
    field :source, Types::SourceType, null: false
    field :source_order, Int, null: true
    field :statement_transcript_position, Types::StatementTranscriptPositionType, null: true
    field :assessment, Types::AssessmentType, null: false
    field :published, Boolean, null: false
    field :count_in_statistics, Boolean, null: false
    field :tags, [Types::TagType], null: false

    field :comments, [Types::CommentType], null: false, resolve: ->(obj, args, ctx) do
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      obj.comments.ordered
    end

    field :comments_count, Int, null: false, resolve: ->(obj, args, ctx) do
      raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

      obj.comments.size
    end
  end
end
