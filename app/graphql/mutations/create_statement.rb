# frozen_string_literal: true

Mutations::CreateStatement = GraphQL::Field.define do
  name "CreateStatement"
  type Types::StatementType
  description "Add new statement"

  argument :statement_input, !Types::StatementInputType

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

      if assessment_input["evaluator_id"].nil? && assessment_input["evaluation_status"] != Assessment::STATUS_UNASSIGNED
        raise GraphQL::ExecutionError.new("When not passing user_id, evaluation_status must be unassigned")
      end

      evaluator_id = assessment_input.delete("evaluator_id")
      if evaluator_id.nil?
        if assessment_input["evaluation_status"] != Assessment::STATUS_UNASSIGNED
          raise GraphQL::ExecutionError.new("When not passing evaluator_id, evaluation_status must be unassigned")
        end
      else
        assessment_input["evaluator"] = User.find(evaluator_id)
      end

      assessment_input["statement"] = statement
      Assessment.create!(assessment_input)

      statement
    end
  }
end
