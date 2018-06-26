# frozen_string_literal: true

class AssessmentValidator < ActiveModel::Validator
  def validate(assessment)
    if assessment.evaluation_status_changed? && !assessment.evaluation_status_was.nil?
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

  STATUS_BEING_EVALUATED = "being_evaluated"
  STATUS_APPROVAL_NEEDED = "approval_needed"
  STATUS_APPROVED = "approved"

  belongs_to :evaluator, class_name: "User", foreign_key: "user_id", optional: true
  belongs_to :veracity, optional: true
  belongs_to :statement

  validates_with AssessmentValidator

  def approved?
    evaluation_status == STATUS_APPROVED
  end

  def unapproved?
    evaluation_status != STATUS_APPROVED
  end

  # Meant to be used after setting new attributes with assign_attributes, just
  # before calling save! on the record
  def is_user_authorized_to_save(user)
    permissions = user.role.permissions

    # With statements:edit, user can edit anything in assessment
    return true if permissions.include?("statements:edit")

    evaluator_allowed_attributes = [
      "veracity_id",
      "explanation_html",
      "explanation_slatejson",
      "short_explanation",
      "evaluation_status"
    ]
    evaluator_allowed_changes =
      evaluation_status_was == STATUS_BEING_EVALUATED &&
      (changed_attributes.keys - evaluator_allowed_attributes).empty?

    if evaluator_allowed_changes && permissions.include?("statements:edit-as-evaluator") && user_id == user.id
      return true
    end

    texts_allowed_attributes = [
      "explanation_html",
      "explanation_slatejson",
      "short_explanation",
    ]
    texts_allowed_changes = unapproved? && (changed_attributes.keys - texts_allowed_attributes).empty?

    if texts_allowed_changes && permissions.include?("statements:edit-texts")
      return true
    end

    changed_attributes.empty?
  end

  def is_user_authorized_to_view_evaluation(user)
    permissions = user.role.permissions

    return true if approved?
    return true if permissions.include?("statements:view-unapproved-evaluation")
    return true if permissions.include?("statements:view-evaluation-as-evaluator") && user.id == user_id

    false
  end
end
