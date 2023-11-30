# frozen_string_literal: true

module Schema::Search::Resolvers
  class SpeakerSearchResultResolver < GraphQL::Schema::Resolver
    type Schema::Search::Types::SearchResultSpeakerType, null: false

    argument :term, GraphQL::Types::String, required: true
    argument :limit, GraphQL::Types::Int, required: false, default_value: 10
    argument :offset, GraphQL::Types::Int, required: false, default_value: 0

    def resolve(term:, limit:, offset:)
      speaker_search = Speaker.query_search(term, from: offset, size: limit)

      { speakers: speaker_search.records.to_a, total_count: speaker_search.total_count }
    end
  end
end
