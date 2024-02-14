# frozen_string_literal: true

class AddPromiseEvaluationArticleType < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TYPE article_type ADD VALUE 'promise_evaluation';
    SQL
  end
end
