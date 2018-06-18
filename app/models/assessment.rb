# frozen_string_literal: true

class AssessmentValidator < ActiveModel::Validator
  def validate(assessment)
    if assessment.evaluation_status_changed?
      case assessment.evaluation_status_was
      when Assessment::STATUS_BEING_EVALUATED
        if assessment.evaluation_status != Assessment::STATUS_APPROVAL_NEEDED
          # raise GraphQL::ExecutionError.new()
          assessment.errors[:evaluation_status] << "Can only change status to #{Assessment::STATUS_APPROVAL_NEEDED} when assessment has status #{Assessment::STATUS_BEING_EVALUATED}"
        end

        if !assessment.veracity || !assessment.short_explanation || !assessment.explanation_html
          assessment.errors[:evaluation_status] << "To be able to change status to #{Assessment::STATUS_APPROVAL_NEEDED}, please fill veracity, short_explanation, and explanation"
        end
      when Assessment::STATUS_APPROVAL_NEEDED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED && assessment.evaluation_status != Assessment::STATUS_APPROVED
          assessment.errors[:evaluation_status] << "Can change status either to #{Assessment::STATUS_BEING_EVALUATED} or #{Assessment::STATUS_APPROVED} when assessment has status #{Assessment::STATUS_APPROVAL_NEEDED}"
        end
      when Assessment::STATUS_APPROVED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED
          assessment.errors[:evaluation_status] << "Can only change status to #{Assessment::STATUS_BEING_EVALUATED} when assessment has status #{Assessment::STATUS_APPROVED}"
        end

        if assessment.statement.published
          assessment.errors[:evaluation_status] << "Cannot change status of published statement, unpublish before changing it"
        end
      else
        raise "Unknown assessment status #{assessment.evaluation_status_was}"
      end
    end
  end
end

class Assessment < ApplicationRecord
  include ActiveModel::Dirty

  STATUS_UNASSIGNED = "unassigned"
  STATUS_BEING_EVALUATED = "being_evaluated"
  STATUS_APPROVAL_NEEDED = "approval_needed"
  STATUS_APPROVED = "approved"

  belongs_to :evaluator, class_name: "User", foreign_key: "user_id", optional: true
  belongs_to :veracity, optional: true
  belongs_to :statement

  validates_with AssessmentValidator
end
