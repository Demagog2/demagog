# frozen_string_literal: true

class RenameEvaluationStatuses < ActiveRecord::Migration[5.2]
  def change
    # Only these two statuses needs to be migrated, because other ones were
    # not migrated from the legacy db
    Assessment.where(evaluation_status: "correct")
      .update_all(evaluation_status: "approved")
    Assessment.where(evaluation_status: "to_be_checked_by_supervisor")
      .update_all(evaluation_status: "approval_needed")
  end
end
