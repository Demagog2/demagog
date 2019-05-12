# frozen_string_literal: true

module Types
  class ArticleSegmentType < BaseObject
    field :id, ID, null: false
    field :segment_type, String, null: false
    field :text_html, String, null: true
    field :text_slatejson, Types::Scalars::JsonType, null: true
    field :source, Types::SourceType, null: true
    field :statements, [Types::StatementType], null: false
    field :promise_url, String, null: true

    def statements
      object.all_published_statements
    end
  end
end
