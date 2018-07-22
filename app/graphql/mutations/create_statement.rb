# frozen_string_literal: true

Mutations::CreateStatement = GraphQL::Field.define do
  name "CreateStatement"
  type Types::StatementType
  description "Add new statement"

  argument :statement_input, !Types::CreateStatementInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["statements:add"])

    statement_input = args[:statement_input].to_h
    transcript_position_input = statement_input.delete("statement_transcript_position")
    assessment_input = statement_input.delete("assessment")
    first_comment_content = statement_input.delete("first_comment_content")

    Statement.transaction do
      statement = Statement.new(statement_input)
      statement.create_notifications(ctx[:current_user])
      statement.save!

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

      assessment = Assessment.new(assessment_input)
      assessment.create_notifications(ctx[:current_user])
      assessment.save!

      if first_comment_content
        Comment.create!(
          statement: statement,
          content: first_comment_content,
          user: ctx[:current_user]
        )
      end

      statement
    end
  }
end
