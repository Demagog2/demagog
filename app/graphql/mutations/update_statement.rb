# frozen_string_literal: true

module Mutations
  class UpdateStatement < GraphQL::Schema::Mutation
    description "Update existing statement"

    field :statement, Types::StatementType, null: false

    argument :id, Int, required: true
    argument :statement_input, Types::UpdateStatementInputType, required: true

    def resolve(id:, statement_input:)
      Utils::Auth.authenticate(context)

      statement_input = statement_input.to_h
      assessment_input = statement_input.delete(:assessment)

      statement = Statement.find(id)

      begin
        Statement.transaction do
          if assessment_input
            evaluator_id = assessment_input.delete(:evaluator_id)

            if evaluator_id.nil? && args[:statement_input][:assessment].key?(:evaluator_id)
              assessment_input[:evaluator] = nil
            elsif !evaluator_id.nil?
              assessment_input[:evaluator] = User.find(evaluator_id)
            end

            statement.assessment.assign_attributes(assessment_input)

            unless statement.assessment.is_user_authorized_to_save(context[:current_user])
              raise Errors::NotAuthorizedError.new
            end

            statement.assessment.create_notifications(context[:current_user])
            statement.assessment.save!
          end

          statement_input[:tags] = statement_input[:tags].map do |tag_id|
            Tag.find(tag_id)
          end

          statement.assign_attributes(statement_input)

          unless statement.is_user_authorized_to_save(context[:current_user])
            raise Errors::NotAuthorizedError.new
          end

          statement.save!

          { statement: statement }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
