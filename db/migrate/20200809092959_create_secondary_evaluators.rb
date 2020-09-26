class CreateSecondaryEvaluators < ActiveRecord::Migration[6.0]
  def change
    create_join_table :assessments, :users, { table_comment: "Secondary evaluators" } do |t|
      t.index :user_id
      t.index :assessment_id
    end
  end
end
