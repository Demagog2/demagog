# frozen_string_literal: true

module Schema::Search::SearchField
  extend ActiveSupport::Concern

  included do
    field :search_speakers, Schema::Search::Types::SearchResultSpeakerType, null: false, resolver: Schema::Search::Resolvers::SpeakerSearchResultResolver
    field :search_articles, Schema::Search::Types::SearchResultArticleType, null: false, resolver: Schema::Search::Resolvers::ArticleSearchResultResolver
  end
end
