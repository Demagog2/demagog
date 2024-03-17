# frozen_string_literal: true

module Types
  class StatementType < BaseObject
    field :id, ID, null: false
    field :statement_type, Types::StatementTypeType, null: false
    field :content, String, null: false
    field :title, String, null: true
    field :excerpted_at, String, null: false
    field :important, Boolean, null: false
    field :source_speaker, Types::SourceSpeakerType, null: false
    field :source, Types::SourceType, null: false
    field :source_order, Int, null: true
    field :statement_transcript_position, Types::StatementTranscriptPositionType, null: true
    field :statement_video_mark, Types::StatementVideoMarkType, null: true
    field :assessment, Types::AssessmentType, null: false
    field :published, Boolean, null: false
    field :tags, [Types::TagType], null: false
    field :comments, [Types::CommentType], null: false
    field :articleTags, [Types::ArticleTagType], null: false

    def source_speaker
      dataloader
        .with(::DataLoaders::ActiveRecordDataLoader, SourceSpeaker)
        .load(object.source_speaker_id)
    end

    def articleTags
      object.article_tags
    end

    def comments
      # Public cannot access comments
      Utils::Auth.authenticate(context)

      object.comments.ordered
    end

    field :comments_count, Int, null: false

    def comments_count
      # Public cannot access comments
      Utils::Auth.authenticate(context)

      object.comments.size
    end
  end
end
