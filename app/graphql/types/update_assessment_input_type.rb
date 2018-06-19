# frozen_string_literal: true

Types::UpdateAssessmentInputType = GraphQL::InputObjectType.define do
  name "UpdateAssessmentInputType"

  argument :evaluator_id, types.ID
  argument :evaluation_status, types.String
  argument :explanation_html, types.String
  argument :explanation_slatejson, Types::Scalars::JsonType
  argument :short_explanation, types.String
  argument :veracity_id, types.ID
end
