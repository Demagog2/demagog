# frozen_string_literal: true

require "test_helper"

class AssessmentAbilityTest < ActiveSupport::TestCase
  test "admin should be authorized to change anything" do
     assessment = create(:assessment, :being_evaluated)
     user = create(:user, :admin)

     changes = {
       short_explanation: "Just short",
       explanation_slatejson: "{}",
       explanation_html: "<p>html</p>",
       veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
     }

     assert AssessmentAbility.new(user).can?(:update, assessment, changes)
   end

  test "expert should be authorized to change anything" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :expert)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "proofreader should be authorized to change texts in unapproved state" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :proofreader)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
    }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  # test "proofreader should not be authorized to change non-text fields in unapproved state" do
  #   assessment = create(:assessment, :being_evaluated)
  #   user = create(:user, :proofreader)

  #   assessment.assign_attributes(veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id)

  #   assert_not AssessmentAbility.new(user).can?(:update, changes)(user)
  # end

  test "social media manager should not be authorized to change anything" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :social_media_manager)

    changes = { short_explanation: "Just short" }

    assert_not AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "intern should be authorized to change explanations and veracity in being_evaluated state when evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
      veracity_new: Assessment::VERACITY_UNVERIFIABLE
    }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "intern should be authorized to change explanations and promise rating of promise statement in being_evaluated state when evaluator" do
    statement = create(:statement, :promise_statement)
    assessment = create(:assessment, :promise_assessment, :being_evaluated, statement:)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      promise_rating_id: PromiseRating.find_by(key: PromiseRating::BROKEN).id,
    }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "intern should not be authorized to change explanations and veracity in being_evaluated state when NOT evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    }

    assert_not AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "intern should be authorized to change status to approval_needed in being_evaluated state when evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    changes = { evaluation_status: Assessment::STATUS_APPROVAL_NEEDED }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "intern should be authorized to change status from approval_needed to being_evaluated when evaluator" do
    assessment = create(:assessment, :approval_needed)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    changes = { evaluation_status: Assessment::STATUS_BEING_EVALUATED }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "intern should not be authorized to change anything when in approval_needed state and when evaluator" do
    assessment = create(:assessment, :approval_needed)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: Veracity.find_by(key: Veracity::UNTRUE).id,
    }

    assert_not AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

  test "proofreader should be authorized to change status to approved in proofreading_needed state" do
    assessment = create(:assessment, :proofreading_needed)
    user = create(:user, :proofreader)

    changes = { evaluation_status:  Assessment::STATUS_APPROVED }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end
end
