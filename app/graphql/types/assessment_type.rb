# frozen_string_literal: true

Types::AssessmentType = GraphQL::ObjectType.define do
  name "Assessment"

  field :id, !types.ID
  field :evaluation_status, !types.String
  field :statement, !Types::StatementType
  field :veracity, Types::VeracityType
  field :evaluator, Types::UserType
  field :short_explanation, types.String

  field :explanation, types.String do
    resolve -> (obj, args, ctx) do
      obj.explanation_html
    end
  end
end
