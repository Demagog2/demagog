# frozen_string_literal: true

module Types
  class UpdateStatementInputType < GraphQL::Schema::InputObject
    argument :content, String, required: false
    argument :title, String, required: false
    argument :important, Boolean, required: false
    argument :published, Boolean, required: false
    argument :count_in_statistics, Boolean, required: false
    argument :assessment, Types::UpdateAssessmentInputType, required: false
  end
end
