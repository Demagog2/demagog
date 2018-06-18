# frozen_string_literal: true

Types::CreateAssessmentInputType = GraphQL::InputObjectType.define do
  name "CreateAssessmentInputType"

  argument :evaluator_id, types.ID
  argument :explanation, types.String
  argument :veracity_id, types.ID
end
