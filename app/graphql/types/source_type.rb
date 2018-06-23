# frozen_string_literal: true

Types::SourceType = GraphQL::ObjectType.define do
  name "Source"

  field :id, !types.ID
  field :name, !types.String
  field :released_at, !types.String
  field :source_url, types.String
  field :transcript, types.String
  field :medium, !Types::MediumType
  field :media_personality, !Types::MediaPersonalityType
  field :speakers, !types[!Types::SpeakerType]

  field :statements, !types[!Types::StatementType] do
    argument :include_unpublished, types.Boolean, default_value: false

    resolve ->(obj, args, ctx) {
      if args[:include_unpublished]
        # Public cannot access unpublished statements
        raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

        statements = Statement.ordered
      else
        statements = Statement.published
      end

      statements
    }
  end

  SourceSpeakersStatementsStatType = GraphQL::ObjectType.define do
    name "SourceSpeakersStatementsStat"

    field :speaker, !Types::SpeakerType, hash_key: :speaker
    field :statements_published_count, !types.Int, hash_key: :statements_published_count
  end

  field :speakers_statements_stats, !types[!SourceSpeakersStatementsStatType] do
    resolve ->(obj, args, ctx) {
      stats = []

      obj.speakers.each do |speaker|
        statements_published_count = speaker.statements
          .published
          .where(source: obj)
          .count

        if statements_published_count > 0
          stats << { speaker: speaker, statements_published_count: statements_published_count }
        end
      end

      stats
    }
  end
end
