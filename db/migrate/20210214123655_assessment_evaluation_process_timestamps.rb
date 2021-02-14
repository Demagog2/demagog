class AssessmentEvaluationProcessTimestamps < ActiveRecord::Migration[6.1]
  def change
    add_column :assessments, :evaluator_first_assigned_at, :datetime
    add_column :assessments, :first_requested_approval_at, :datetime
    add_column :assessments, :first_requested_proofreading_at, :datetime
    add_column :assessments, :first_approved_at, :datetime
    add_column :assessments, :evaluation_started_at, :datetime
    add_column :assessments, :evaluation_ended_at, :datetime
  end
end
