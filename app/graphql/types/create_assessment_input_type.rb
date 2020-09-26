# frozen_string_literal: true

module Types
  class CreateAssessmentInputType < GraphQL::Schema::InputObject
    argument :evaluator_id, ID, required: false
    argument :secondary_evaluator_ids, [ID], required: false
    argument :short_explanation, String, required: false
    argument :veracity_id, ID, required: false
  end
end
