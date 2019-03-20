# frozen_string_literal: true

require "test_helper"

class AssessmentTest < ActiveSupport::TestCase
  setup do
    ensure_veracities
  end

  test "admin should be authorized to change anything" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :admin)

    assessment.assign_attributes(
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    )

    assert assessment.is_user_authorized_to_save(user)
  end

  test "expert should be authorized to change anything" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :expert)

    assessment.assign_attributes(
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    )

    assert assessment.is_user_authorized_to_save(user)
  end

  test "proofreader should be authorized to change texts in unapproved state" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :proofreader)

    assessment.assign_attributes(
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
    )

    assert assessment.is_user_authorized_to_save(user)
  end

  test "proofreader should not be authorized to change non-text fields in unapproved state" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :proofreader)

    assessment.assign_attributes(veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id)

    assert_not assessment.is_user_authorized_to_save(user)
  end

  test "social media manager should not be authorized to change anything" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :social_media_manager)

    assessment.assign_attributes(short_explanation: "Just short")

    assert_not assessment.is_user_authorized_to_save(user)
  end

  test "intern should be authorized to change explanations and veracity in being_evaluated state when evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    assessment.assign_attributes(
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    )

    assert assessment.is_user_authorized_to_save(user)
  end

  test "intern should not be authorized to change explanations and veracity in being_evaluated state when NOT evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)

    assessment.assign_attributes(
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    )

    assert_not assessment.is_user_authorized_to_save(user)
  end

  test "intern should be authorized to change status to approval_needed in being_evaluated state when evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    assessment.evaluation_status = Assessment::STATUS_APPROVAL_NEEDED

    assert assessment.is_user_authorized_to_save(user)
  end

  test "intern should not be authorized to change anything when in approval_needed state and when evaluator" do
    assessment = create(:assessment, :approval_needed)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    assessment.assign_attributes(
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    )

    assert_not assessment.is_user_authorized_to_save(user)
  end

  test "proofreader should be authorized to change status to approved in proofreading_needed state" do
    assessment = create(:assessment, :proofreading_needed)
    user = create(:user, :proofreader)

    assessment.evaluation_status = Assessment::STATUS_APPROVED

    assert assessment.is_user_authorized_to_save(user)
  end

  test "admin should be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :admin)

    assert assessment.is_user_authorized_to_view_evaluation(user)
  end

  test "proofreader should be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :proofreader)

    assert assessment.is_user_authorized_to_view_evaluation(user)
  end

  test "social media manager should be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :social_media_manager)

    assert assessment.is_user_authorized_to_view_evaluation(user)
  end

  test "intern should not be authorized to view unapproved assessment evaluation when NOT evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)

    assert_not assessment.is_user_authorized_to_view_evaluation(user)
  end

  test "intern should be authorized to view unapproved assessment evaluation when evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    assert assessment.is_user_authorized_to_view_evaluation(user)
  end

  test "unauthenticated user should be authorized to view approved assessment evaluation" do
    assessment = create(:assessment)

    assert assessment.is_user_authorized_to_view_evaluation(nil)
  end

  test "unauthenticated user should not be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)

    assert_not assessment.is_user_authorized_to_view_evaluation(nil)
  end
end
