# frozen_string_literal: true

module Mutations
  class CreateStatement < GraphQL::Schema::Mutation
    description "Add new statement"

    field :statement, Types::StatementType, null: false

    argument :statement_input, Types::CreateStatementInputType, required: true

    def resolve(statement_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, ["statements:add"])

      statement_input = statement_input.to_h
      transcript_position_input = statement_input.delete(:statement_transcript_position)
      assessment_input = statement_input.delete(:assessment)
      first_comment_content = statement_input.delete(:first_comment_content)

      Statement.transaction do
        statement = Statement.new(statement_input)
        statement.save!

        if transcript_position_input
          transcript_position_input[:statement_id] = statement.id
          transcript_position_input[:source_id] = statement.source.id
          StatementTranscriptPosition.create!(transcript_position_input)
        end

        evaluator_id = assessment_input.delete(:evaluator_id)
        unless evaluator_id.nil?
          assessment_input[:evaluator] = User.find(evaluator_id)
        end

        assessment_input[:statement] = statement
        assessment_input[:evaluation_status] = Assessment::STATUS_BEING_EVALUATED

        assessment = Assessment.new(assessment_input)
        # FIXME: We don't want methodology picking hardcoded, do we set it on source level?
        if statement.statement_type == Statement::TYPE_PROMISE
          assessment.assessment_methodology = AssessmentMethodology.find_by!(name: "Demagog.cz metodika analýzy slibů druhé vlády Andreje Babiše")
        else
          assessment.assessment_methodology = AssessmentMethodology.find_by!(name: "Demagog.cz fact-checking metodika")
        end
        assessment.create_notifications(context[:current_user])
        assessment.save!

        if first_comment_content
          Comment.create!(
            statement: statement,
            content: first_comment_content,
            user: context[:current_user]
          )
        end

        { statement: statement }
      end
    end
  end
end
