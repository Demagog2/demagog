# frozen_string_literal: true

module Mutations
  class UpdateStatementsVideoMarks < GraphQL::Schema::Mutation
    description "Update video marks for given statements"

    field :statements, [Types::StatementType], null: false

    argument :id, ID, required: true
    argument :statements_video_marks_input, [Types::StatementsVideoMarksInputType], required: true

    def resolve(id:, statements_video_marks_input:)
      Utils::Auth.authenticate(context)
      Utils::Auth.authorize(context, %w[statements:edit])

      statements = Statement.transaction do
        statements_video_marks_input.map(&:to_h).map do |statements_video_mark_input|
          statement = Statement.find(statements_video_mark_input[:statement_id])

          unless statement.statement_video_mark.present?
            statement.build_statement_video_mark(statement_id: statement.id, source_id: id)
          end

          statement.statement_video_mark.start = statements_video_mark_input[:start]
          statement.statement_video_mark.stop = statements_video_mark_input[:stop]
          statement.statement_video_mark.save!

          statement
        end
      end

      { statements: }
    end
  end
end
