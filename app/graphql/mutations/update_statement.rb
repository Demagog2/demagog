# frozen_string_literal: true

Mutations::UpdateStatement = GraphQL::Field.define do
  name "UpdateStatement"
  type Types::StatementType
  description "Update existing statement"

  argument :id, !types.Int
  argument :statement_input, !Types::UpdateStatementInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    statement_input = args[:statement_input].to_h
    assessment_input = statement_input.delete("assessment")

    statement = Statement.find(args[:id])

    begin
      Statement.transaction do
        if assessment_input
          evaluator_id = assessment_input.delete("evaluator_id")

          if evaluator_id.nil? && args[:statement_input][:assessment].key?("evaluator_id")
            assessment_input["evaluator"] = nil
          elsif !evaluator_id.nil?
            assessment_input["evaluator"] = User.find(evaluator_id)
          end

          statement.assessment.update!(assessment_input)
        end

        statement.update!(statement_input)

        statement
      end
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
