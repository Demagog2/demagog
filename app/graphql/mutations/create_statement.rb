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

    Statement.transaction do
      statement = Statement.create!(statement_input)

      if transcript_position_input
        transcript_position_input["statement_id"] = statement.id
        transcript_position_input["source_id"] = statement.source.id
        StatementTranscriptPosition.create!(transcript_position_input)
      end
      
      statement
    end
  }
end
