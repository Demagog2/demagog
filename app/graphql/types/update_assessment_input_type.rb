# frozen_string_literal: true

module Types
  class UpdateAssessmentInputType < GraphQL::Schema::InputObject
    argument :evaluator_id, ID, required: false
    argument :evaluation_status, String, required: false
    argument :explanation_html, String, required: false
    argument :explanation_slatejson, Types::Scalars::JsonType, required: false
    argument :short_explanation, String, required: false
    argument :veracity_id, ID, required: false
  end
end
