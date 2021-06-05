# frozen_string_literal: true

module Types
  class ArticleSegmentType < BaseObject
    field :id, ID, null: false
    field :segment_type, String, null: false, description: "Can be: source_statements, single_statement, promise or text"
    field :text_html, String, null: true, description: "If text segment type, returns the text in HTML for this segment"
    field :text_slatejson, Types::Scalars::JsonType, null: true, description: "If text segment type, returns the text in JSON for this segment", deprecation_reason: "We don't use JSON text representation anymore"
    field :source, Types::SourceType, null: true, description: "If source_statements segment type, returns the source from which we take the statements for this segment"
    field :statements, [Types::StatementType], null: false, description: "If source_statements or single_statement segment type, returns the statements for this segment"
    field :promise_url, String, null: true, description: "If promise segment type, returns the url of promise for this segment"
    field :statement_id, String, null: true, description: "If single_statement segment type, returns the ID of statement for this segment"

    def statements
      object.all_published_statements
    end
  end
end
