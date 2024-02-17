# frozen_string_literal: true

class RenamePromiseEvaluationToGovPromiseEvaluation < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TYPE article_type RENAME VALUE 'promise_evaluation' TO 'government_promises_evaluation'
    SQL
  end

  def down
    execute <<-SQL
      ALTER TYPE article_type RENAME VALUE 'government_promises_evaluation' TO 'promise_evaluation'
    SQL
  end
end
