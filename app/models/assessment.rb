# frozen_string_literal: true

class Assessment < ApplicationRecord
  STATUS_UNASSIGNED = "unassigned"
  STATUS_BEING_EVALUATED = "being_evaluated"
  STATUS_APPROVAL_NEEDED = "approval_needed"
  STATUS_APPROVED = "approved"

  belongs_to :evaluator, class_name: "User", foreign_key: "user_id", optional: true
  belongs_to :veracity, optional: true
  belongs_to :statement
end
