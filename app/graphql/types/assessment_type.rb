# frozen_string_literal: true

Types::AssessmentType = GraphQL::ObjectType.define do
  name "Assessment"

  field :id, !types.ID
  field :explanation, types.String
  field :evaluation_status, !types.String
  field :statement, !Types::StatementType
  field :veracity, Types::VeracityType
  field :evaluator, Types::UserType
end
