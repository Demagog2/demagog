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
            if assessment_input.key?(:evaluator_id)
              evaluator_id = assessment_input.delete(:evaluator_id)

              if evaluator_id.nil?
                assessment_input[:evaluator] = nil
              else
                assessment_input[:evaluator] = User.find(evaluator_id)
              end
            end

            if assessment_input[:veracity_id]
              assessment_input[:veracity_new] = Veracity.find(assessment_input[:veracity_id]).key
            end

            statement.assessment.assign_attributes(assessment_input)

            unless statement.assessment.user_authorized_to_save?(context[:current_user])
              raise Errors::NotAuthorizedError.new
            end

            statement.assessment.create_notifications(context[:current_user])
            statement.assessment.save!
            statement.assessment.post_to_proofreading_slack
          end

          if statement_input.key?(:tags)
            statement_input[:tags] = statement_input[:tags].map do |tag_id|
              Tag.find(tag_id)
            end
          end
          if statement_input.key?(:article_tags)
            statement_input[:article_tags] = statement_input[:article_tags].map do |article_tag_id|
              ArticleTag.find(article_tag_id)
            end
          end

          statement.assign_attributes(statement_input)

          unless statement.is_user_authorized_to_save(context[:current_user])
            raise Errors::NotAuthorizedError.new
          end

          UserNotificationService.new(statement:, current_user: context[:current_user]).run

          statement.save!

          { statement: }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError.new(e.to_s)
      end
    end
  end
end
