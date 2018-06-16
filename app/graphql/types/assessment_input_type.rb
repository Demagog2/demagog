# frozen_string_literal: true

Types::AssessmentInputType = GraphQL::InputObjectType.define do
  name "AssessmentInputType"

  argument :evaluation_status, !types.String
  argument :evaluator_id, types.ID
  argument :explanation, types.String
  argument :veracity_id, types.ID
end
