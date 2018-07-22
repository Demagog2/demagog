# frozen_string_literal: true

Mutations::UpdateStatement = GraphQL::Field.define do
  name "UpdateStatement"
  type Types::StatementType
  description "Update existing statement"

  argument :id, !types.Int
  argument :statement_input, !Types::UpdateStatementInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)

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

          statement.assessment.assign_attributes(assessment_input)

          unless statement.assessment.is_user_authorized_to_save(ctx[:current_user])
            raise Errors::NotAuthorizedError.new
          end

          statement.assessment.create_notifications(ctx[:current_user])
          statement.assessment.save!
        end

        statement.assign_attributes(statement_input)

        unless statement.is_user_authorized_to_save(ctx[:current_user])
          raise Errors::NotAuthorizedError.new
        end

        statement.create_notifications(ctx[:current_user])
        statement.save!

        statement
      end
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
