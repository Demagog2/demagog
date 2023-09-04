# frozen_string_literal: true

module Types
  class UpdateStatementInputType < GraphQL::Schema::InputObject
    argument :content, String, required: false
    argument :title, String, required: false
    argument :important, Boolean, required: false
    argument :published, Boolean, required: false
    argument :assessment, Types::UpdateAssessmentInputType, required: false
    argument :tags, [ID], required: false
    argument :source_speaker_id, ID, required: false
    argument :article_tags, [ID], required: false
  end
end
