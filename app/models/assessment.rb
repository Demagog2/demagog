# frozen_string_literal: true

require "nokogiri"

class AssessmentValidator < ActiveModel::Validator
  def validate(assessment)
    if assessment.evaluation_status_changed? && !assessment.evaluation_status_was.nil?
      case assessment.evaluation_status_was
      when Assessment::STATUS_BEING_EVALUATED
        if assessment.evaluation_status != Assessment::STATUS_APPROVAL_NEEDED
          assessment.errors[:evaluation_status] << "Can only change status to #{Assessment::STATUS_APPROVAL_NEEDED} when assessment has status #{Assessment::STATUS_BEING_EVALUATED}"
        end

        if assessment.statement.statement_type == Statement::TYPE_FACTUAL
          if !assessment.veracity || !assessment.short_explanation || !assessment.explanation_html
            assessment.errors[:evaluation_status] << "To be able to change status to #{Assessment::STATUS_APPROVAL_NEEDED}, please fill veracity, short_explanation, and explanation"
          end
        end
        if assessment.statement.statement_type == Statement::TYPE_PROMISE
          if !assessment.promise_rating || !assessment.short_explanation || !assessment.explanation_html
            assessment.errors[:evaluation_status] << "To be able to change status to #{Assessment::STATUS_APPROVAL_NEEDED}, please fill promise rating, short_explanation, and explanation"
          end
        end
      when Assessment::STATUS_APPROVAL_NEEDED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED && assessment.evaluation_status != Assessment::STATUS_PROOFREADING_NEEDED
          assessment.errors[:evaluation_status] << "Can change status either to #{Assessment::STATUS_BEING_EVALUATED} or #{Assessment::STATUS_PROOFREADING_NEEDED} when assessment has status #{Assessment::STATUS_APPROVAL_NEEDED}"
        end
      when Assessment::STATUS_PROOFREADING_NEEDED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED && assessment.evaluation_status != Assessment::STATUS_APPROVED
          assessment.errors[:evaluation_status] << "Can change status either to #{Assessment::STATUS_BEING_EVALUATED} or #{Assessment::STATUS_APPROVED} when assessment has status #{Assessment::STATUS_PROOFREADING_NEEDED}"
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
  STATUS_PROOFREADING_NEEDED = "proofreading_needed"
  STATUS_APPROVED = "approved"

  belongs_to :evaluator, class_name: "User", foreign_key: "user_id", optional: true
  belongs_to :veracity, optional: true
  belongs_to :promise_rating, optional: true
  belongs_to :statement
  belongs_to :assessment_methodology

  validates_with AssessmentValidator
  validates :veracity, absence: true, unless: Proc.new { |a| a.assessment_methodology.rating_model == AssessmentMethodology::RATING_MODEL_VERACITY }
  validates :promise_rating, absence: true, unless: Proc.new { |a| a.assessment_methodology.rating_model == AssessmentMethodology::RATING_MODEL_PROMISE_RATING }

  def approved?
    evaluation_status == STATUS_APPROVED
  end

  def unapproved?
    evaluation_status != STATUS_APPROVED
  end

  def short_explanation_characters_length
    return 0 if short_explanation.nil?
    short_explanation.length
  end

  def explanation_characters_length
    return 0 if explanation_html.nil?
    fragment = Nokogiri::HTML.fragment(explanation_html)
    fragment.text.length
  end

  # Meant to be used after setting new attributes with assign_attributes, just
  # before calling save! on the record
  def is_user_authorized_to_save(user)
    permissions = user.role.permissions

    # With statements:edit, user can edit anything in assessment
    return true if permissions.include?("statements:edit")

    evaluator_allowed_attributes = [
      "veracity_id",
      "promise_rating_id",
      "explanation_html",
      "explanation_slatejson",
      "short_explanation",
      "evaluation_status"
    ]
    evaluator_allowed_changes =
      (
        evaluation_status_was == STATUS_BEING_EVALUATED &&
        (changed_attributes.keys - evaluator_allowed_attributes).empty?
      ) ||
      (
        evaluation_status_was == STATUS_APPROVAL_NEEDED &&
        evaluation_status == STATUS_BEING_EVALUATED &&
        changed_attributes.keys == ["evaluation_status"]
      )

    if evaluator_allowed_changes && permissions.include?("statements:edit-as-evaluator") && user_id == user.id
      return true
    end

    texts_allowed_attributes = [
      "explanation_html",
      "explanation_slatejson",
      "short_explanation"
    ]
    texts_allowed_changes = unapproved? && (changed_attributes.keys - texts_allowed_attributes).empty?
    proofreader_allowed_changes = texts_allowed_changes || (evaluation_status_was == STATUS_PROOFREADING_NEEDED)

    if proofreader_allowed_changes && permissions.include?("statements:edit-as-proofreader")
      return true
    end

    changed_attributes.empty?
  end

  def is_user_authorized_to_view_evaluation(user)
    # Evaluation of approved assessment is always viewable
    return true if approved?

    # Otherwise it is viewable only to authenticated users with proper permissions
    if user
      permissions = user.role.permissions
      return true if permissions.include?("statements:view-unapproved-evaluation")
      return true if permissions.include?("statements:view-evaluation-as-evaluator") && user.id == user_id
    end

    false
  end

  # Meant to be used after setting new attributes with assign_attributes, just
  # before calling save! on the record
  def create_notifications(current_user)
    if user_id_changed?
      notifications = []

      unless user_id.nil?
        begin
          evaluator = User.find(user_id)

          notifications << Notification.new(
            content: "#{current_user.display_in_notification} tě vybral/a jako ověřovatele/ku výroku #{statement.display_in_notification}",
            action_link: "/admin/statements/#{statement.id}",
            action_text: "Na detail výroku",
            recipient: evaluator
          )

          if statement.source.expert
            notifications << Notification.new(
              content: "#{current_user.display_in_notification} vybral/a #{evaluator.display_in_notification} jako ověřovatele/ku tebou expertovaného výroku #{statement.display_in_notification}",
              action_link: "/admin/statements/#{statement.id}",
              action_text: "Na detail výroku",
              recipient: statement.source.expert
            )
          end
        rescue ActiveRecord::RecordNotFound
          logger.debug "User #{user_id} not found. Notification not send."
        end
      end

      unless user_id_was.nil?
        begin
          evaluator_was = User.find(user_id_was)

          notifications << Notification.new(
            content: "#{current_user.display_in_notification} tě odebral/a z pozice ověřovatele/ky výroku #{statement.display_in_notification}",
            action_link: "/admin/statements/#{statement.id}",
            action_text: "Na detail výroku",
            recipient: evaluator_was
          )

          if statement.source.expert
            notifications << Notification.new(
              content: "#{current_user.display_in_notification} odebral/a #{evaluator_was.display_in_notification} z pozice ověřovatele/ky tebou expertovaného výroku #{statement.display_in_notification}",
              action_link: "/admin/statements/#{statement.id}",
              action_text: "Na detail výroku",
              recipient: statement.source.expert
            )
          end
        rescue ActiveRecord::RecordNotFound
          logger.debug "User #{user_id_was} not found. Notification not send."
        end
      end

      Notification.create_notifications(notifications, current_user)
    end

    if evaluation_status_changed? && !evaluation_status_was.nil?
      notifications = []

      evaluation_status_label = case evaluation_status
                                when STATUS_BEING_EVALUATED then "ve zpracování"
                                when STATUS_APPROVAL_NEEDED then "ke kontrole"
                                when STATUS_PROOFREADING_NEEDED then "ke korektuře"
                                when STATUS_APPROVED then "schválený"
                                else evaluation_status
      end

      # Temporarily sending notification to expert only when status is changed to
      # approval_needed, because we are finetuning the notifications
      if statement.source.expert && evaluation_status == STATUS_APPROVAL_NEEDED
        notifications << Notification.new(
          content: "#{current_user.display_in_notification} změnil/a stav tebou expertovaného výroku #{statement.display_in_notification} na #{evaluation_status_label}",
          action_link: "/admin/statements/#{statement.id}",
          action_text: "Na detail výroku",
          recipient: statement.source.expert
        )
      end

      if user_id
        notifications << Notification.new(
          content: "#{current_user.display_in_notification} změnil/a stav tebou ověřovaného výroku #{statement.display_in_notification} na #{evaluation_status_label}",
          action_link: "/admin/statements/#{statement.id}",
          action_text: "Na detail výroku",
          recipient: User.find(user_id)
        )
      end

      Notification.create_notifications(notifications, current_user)
    end
  end
end
