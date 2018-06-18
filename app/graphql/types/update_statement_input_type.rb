# frozen_string_literal: true

Types::UpdateStatementInputType = GraphQL::InputObjectType.define do
  name "UpdateStatementInputType"

  argument :content, types.String
  argument :important, types.Boolean
  argument :published, types.Boolean
  argument :count_in_statistics, types.Boolean
  argument :assessment, Types::UpdateAssessmentInputType
end
