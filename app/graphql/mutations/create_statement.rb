# frozen_string_literal: true

Mutations::CreateStatement = GraphQL::Field.define do
  name "CreateStatement"
  type Types::StatementType
  description "Add new statement"

  argument :statement_input, !Types::CreateStatementInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    statement_input = args[:statement_input].to_h
    transcript_position_input = statement_input.delete("statement_transcript_position")
    assessment_input = statement_input.delete("assessment")

    Statement.transaction do
      statement = Statement.create!(statement_input)

      if transcript_position_input
        transcript_position_input["statement_id"] = statement.id
        transcript_position_input["source_id"] = statement.source.id
        StatementTranscriptPosition.create!(transcript_position_input)
      end

      evaluator_id = assessment_input.delete("evaluator_id")
      unless evaluator_id.nil?
        assessment_input["evaluator"] = User.find(evaluator_id)
      end

      assessment_input["statement"] = statement
      assessment_input["evaluation_status"] = Assessment::STATUS_BEING_EVALUATED
      Assessment.create!(assessment_input)

      statement.source.regenerate_statements_order

      statement
    end
  }
end
