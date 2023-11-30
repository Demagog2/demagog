# frozen_string_literal: true

module Schema::Search::Types
  class SearchResultSpeakerType < Types::BaseObject
    field :speakers, [Types::SpeakerType], null: false
    field :total_count, GraphQL::Types::Int, null: false
  end
end
