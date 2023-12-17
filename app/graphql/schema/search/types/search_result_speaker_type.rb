# frozen_string_literal: true

module Schema::Search::Types
  class SearchResultSpeakerType < Types::BaseObject
    field :speakers, [Types::SpeakerType], null: false
    field :body_groups, [BodyGroupType], null: false
    field :total_count, GraphQL::Types::Int, null: false
  end
end
