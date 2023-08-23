# frozen_string_literal: true

require "nokogiri"

class AssessmentValidator < ActiveModel::Validator
  def validate(assessment)
    if assessment.evaluation_status_changed? && !assessment.evaluation_status_was.nil?
      case assessment.evaluation_status_was
      when Assessment::STATUS_BEING_EVALUATED
        if assessment.evaluation_status != Assessment::STATUS_APPROVAL_NEEDED
          assessment.errors.add(:evaluation_status, "Can only change status to #{Assessment::STATUS_APPROVAL_NEEDED} when assessment has status #{Assessment::STATUS_BEING_EVALUATED}")
        end

        if assessment.statement.statement_type == Statement::TYPE_FACTUAL || assessment.statement.statement_type == Statement::TYPE_NEWYEARS
          if !assessment.veracity || !assessment.short_explanation || !assessment.explanation_html
            assessment.errors.add(:evaluation_status, "To be able to change status to #{Assessment::STATUS_APPROVAL_NEEDED}, please fill veracity, short_explanation, and explanation")
          end
        end
        if assessment.statement.statement_type == Statement::TYPE_PROMISE
          if !assessment.promise_rating || !assessment.short_explanation || !assessment.explanation_html
            assessment.errors.add(:evaluation_status, "To be able to change status to #{Assessment::STATUS_APPROVAL_NEEDED}, please fill promise rating, short_explanation, and explanation")
          end
        end
      when Assessment::STATUS_APPROVAL_NEEDED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED && assessment.evaluation_status != Assessment::STATUS_PROOFREADING_NEEDED
          assessment.errors.add(:evaluation_status, "Can change status either to #{Assessment::STATUS_BEING_EVALUATED} or #{Assessment::STATUS_PROOFREADING_NEEDED} when assessment has status #{Assessment::STATUS_APPROVAL_NEEDED}")
        end
      when Assessment::STATUS_PROOFREADING_NEEDED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED && assessment.evaluation_status != Assessment::STATUS_APPROVED
          assessment.errors.add(:evaluation_status, "Can change status either to #{Assessment::STATUS_BEING_EVALUATED} or #{Assessment::STATUS_APPROVED} when assessment has status #{Assessment::STATUS_PROOFREADING_NEEDED}")
        end
      when Assessment::STATUS_APPROVED
        if assessment.evaluation_status != Assessment::STATUS_BEING_EVALUATED
          assessment.errors.add(:evaluation_status, "Can only change status to #{Assessment::STATUS_BEING_EVALUATED} when assessment has status #{Assessment::STATUS_APPROVED}")
        end

        if assessment.statement.published
          assessment.errors.add(:evaluation_status, "Cannot change status of published statement, unpublish before changing it")
        end
      else
        raise "Unknown assessment status #{assessment.evaluation_status_was}"
      end
    end
  end
end

class Assessment < ApplicationRecord
  include ActiveModel::Dirty

  has_paper_trail

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
  validates :veracity_new, absence: true, unless: Proc.new { |a| a.assessment_methodology.rating_model == AssessmentMethodology::RATING_MODEL_VERACITY }
  validates :promise_rating, absence: true, unless: Proc.new { |a| a.assessment_methodology.rating_model == AssessmentMethodology::RATING_MODEL_PROMISE_RATING }

  before_save :record_evaluation_process_timestamps

  VERACITIES = [
    VERACITY_TRUE = "true",
    VERACITY_UNTRUE = "untrue",
    VERACITY_MISLEADING = "misleading",
    VERACITY_UNVERIFIABLE = "unverifiable",
  ].freeze

  enum veracity_new: {
    true: VERACITY_TRUE,
    untrue: VERACITY_UNTRUE,
    misleading: VERACITY_MISLEADING,
    unverifiable: VERACITY_UNVERIFIABLE
  }, _prefix: "veracity"

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

  def explanation_text
    return "" if explanation_html.nil?
    Nokogiri::HTML(explanation_html).text
  end

  def explanation_characters_length
    return 0 if explanation_html.nil?
    fragment = Nokogiri::HTML.fragment(explanation_html)
    fragment.text.length
  end

  def veracity_name
    I18n.t("veracity.names.#{veracity_new}")
  end

  # Meant to be used after setting new attributes with assign_attributes, just
  # before calling save! on the record
  def is_user_authorized_to_save(user)
    # With statements:edit, user can edit anything in assessment
    return true if user.authorized?("statements:edit")

    evaluator_allowed_attributes = %w[veracity_new veracity_id promise_rating_id explanation_html explanation_slatejson short_explanation evaluation_status]
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

    if evaluator_allowed_changes && user.authorized?("statements:edit-as-evaluator") && evaluated_by?(user)
      return true
    end

    texts_allowed_attributes = [
      "explanation_html",
      "explanation_slatejson",
      "short_explanation"
    ]
    texts_allowed_changes = unapproved? && (changed_attributes.keys - texts_allowed_attributes).empty?
    proofreader_allowed_changes = texts_allowed_changes || (evaluation_status_was == STATUS_PROOFREADING_NEEDED)

    if proofreader_allowed_changes && user.authorized?("statements:edit-as-proofreader")
      return true
    end

    changed_attributes.empty?
  end

  def is_user_authorized_to_view_evaluation(user)
    # Evaluation of approved assessment is always viewable
    return true if approved?

    # Otherwise it is viewable only to authenticated users with proper permissions
    if user
      return true if user.authorized?("statements:view-unapproved-evaluation")
      return true if user.authorized?("statements:view-evaluation-as-evaluator") && evaluated_by?(user)
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
            statement_text: "#{current_user.display_in_notification} tě vybral/a jako ověřovatele/ku",
            full_text: "#{current_user.display_in_notification} tě vybral/a jako ověřovatele/ku výroku #{statement.display_in_notification}",
            statement_id: statement.id,
            recipient: evaluator
          )
        rescue ActiveRecord::RecordNotFound
          logger.debug "User #{user_id} not found. Notification not send."
        end
      end

      unless user_id_was.nil?
        begin
          evaluator_was = User.find(user_id_was)

          notifications << Notification.new(
            statement_text: "#{current_user.display_in_notification} tě odebral/a z pozice ověřovatele/ky",
            full_text: "#{current_user.display_in_notification} tě odebral/a z pozice ověřovatele/ky výroku #{statement.display_in_notification}",
            statement_id: statement.id,
            recipient: evaluator_was
          )
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

      # Temporarily sending notification to experts only when status is changed to
      # approval_needed, because we are finetuning the notifications
      if evaluation_status == STATUS_APPROVAL_NEEDED
        statement.source.experts.each do |expert|
          notifications << Notification.new(
            statement_text: "#{current_user.display_in_notification} změnil/a stav na #{evaluation_status_label}",
            full_text: "#{current_user.display_in_notification} změnil/a stav tebou editovaného výroku #{statement.display_in_notification} na #{evaluation_status_label}",
            statement_id: statement.id,
            recipient: expert
          )
        end
      end

      if user_id
        notifications << Notification.new(
          statement_text: "#{current_user.display_in_notification} změnil/a stav na #{evaluation_status_label}",
          full_text: "#{current_user.display_in_notification} změnil/a stav tebou ověřovaného výroku #{statement.display_in_notification} na #{evaluation_status_label}",
          statement_id: statement.id,
          recipient: User.find(user_id)
        )
      end

      if evaluation_status == STATUS_APPROVED
        # These notifications will be skipped for users who are being already notified about processed changes
        User.active.where(notify_on_approval: true).each do |user|
          notifications << Notification.new(
            statement_text: "#{current_user.display_in_notification} změnil/a stav na #{evaluation_status_label}",
            full_text: "#{current_user.display_in_notification} změnil/a stav výroku #{statement.display_in_notification} na #{evaluation_status_label}",
            statement_id: statement.id,
            recipient: user
          )
        end
      end

      Notification.create_notifications(notifications, current_user)
    end
  end

  def post_to_proofreading_slack
    if evaluation_status_previously_changed? && evaluation_status == STATUS_PROOFREADING_NEEDED
      proofreading_needed_count = statement.source.statements.select { |s| s.assessment.evaluation_status == STATUS_PROOFREADING_NEEDED }.size

      if proofreading_needed_count > 0 && proofreading_needed_count % 5 == 0
        source_url = "https://demagog.cz/admin/sources/#{statement.source.id}?filter=%7B%22field%22%3A%22assessment.evaluationStatus%22%2C%22value%22%3A%22proofreading_needed%22%7D"
        SlackNotifier::ProofreadingNotifier.post text: "<!channel> Ahoj, máme tu v diskuzi *#{statement.source.name}* už #{proofreading_needed_count} výroků ke korektuře. Prosíme o projití. Díky!\n#{source_url}"
      end
    end
  end

  def evaluated_by?(user)
    user_id == user.id
  end

  private
    def record_evaluation_process_timestamps
      if !user_id.nil? && evaluator_first_assigned_at.nil?
        self.evaluator_first_assigned_at = Time.now
      end

      if evaluation_status == Assessment::STATUS_APPROVAL_NEEDED && first_requested_approval_at.nil?
        self.first_requested_approval_at = Time.now
      end

      if evaluation_status == Assessment::STATUS_PROOFREADING_NEEDED && first_requested_proofreading_at.nil?
        self.first_requested_proofreading_at = Time.now
      end

      if evaluation_status == Assessment::STATUS_APPROVED && first_approved_at.nil?
        self.first_approved_at = Time.now
      end

      is_updating_evaluation = short_explanation_changed? || explanation_html_changed? || veracity_id_changed? || promise_rating_id_changed?

      if is_updating_evaluation && evaluation_started_at.nil?
        self.evaluation_started_at = Time.now
      end

      if is_updating_evaluation
        self.evaluation_ended_at = Time.now
      end
    end
end
