# frozen_string_literal: true

class FillAssessmentTimestampsFromVersions < ActiveRecord::Migration[6.1]
  def up
    assessments = Assessment.where("id >= ?", 12016).order(id: :asc)

    assessments.each do |assessment|
      puts "Processing assessment id #{assessment.id}"

      if assessment.statement && assessment.versions.length > 0
        assessment.versions.each do |version|
          if version.changeset.has_key?("user_id") && assessment.evaluator_first_assigned_at.nil?
            assessment.evaluator_first_assigned_at = version.created_at
          end

          if version.changeset.has_key?("evaluation_status") && version.changeset["evaluation_status"][1] == Assessment::STATUS_APPROVAL_NEEDED && assessment.first_requested_approval_at.nil?
            assessment.first_requested_approval_at = version.created_at
          end

          if version.changeset.has_key?("evaluation_status") && version.changeset["evaluation_status"][1] == Assessment::STATUS_PROOFREADING_NEEDED && assessment.first_requested_proofreading_at.nil?
            assessment.first_requested_proofreading_at = version.created_at
          end

          if version.changeset.has_key?("evaluation_status") && version.changeset["evaluation_status"][1] == Assessment::STATUS_APPROVED && assessment.first_approved_at.nil?
            assessment.first_approved_at = version.created_at
          end

          is_updating_evaluation = version.changeset.has_key?("short_explanation") ||
            version.changeset.has_key?("explanation_html") ||
            version.changeset.has_key?("veracity_id") ||
            version.changeset.has_key?("promise_rating_id")

          if is_updating_evaluation && assessment.evaluation_started_at.nil?
            assessment.evaluation_started_at = version.created_at
          end

          if is_updating_evaluation
            assessment.evaluation_ended_at = version.created_at
          end
        end

        assessment.save! if assessment.changed?
      end
    end
  end

  def down
    # nothing
  end
end
