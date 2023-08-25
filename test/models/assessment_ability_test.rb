# frozen_string_literal: true

require "test_helper"

class AssessmentAbilityTest < ActiveSupport::TestCase
  test "admin should be authorized to change anything" do
     assessment = create(:assessment, :being_evaluated)
     user = create(:user, :admin)
     veracity = create(:veracity)

     changes = {
       short_explanation: "Just short",
       explanation_slatejson: "{}",
       explanation_html: "<p>html</p>",
       veracity_id: veracity.id,
     }

     assert AssessmentAbility.new(user).can?(:update, assessment, changes)
   end

  test "expert should be authorized to change anything" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :expert)
    veracity = create(:veracity, key: Assessment::VERACITY_UNTRUE)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: veracity.id,
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

  test "proofreader should be authorized to change non-text fields in unapproved state" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :proofreader)

    changes = {
      veracity_new: Assessment::VERACITY_UNVERIFIABLE
    }

    assert AssessmentAbility.new(user).can?(:update, assessment, changes)
  end

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
    veracity = create(:veracity, key: Assessment::VERACITY_UNVERIFIABLE)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: veracity.id,
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
    veracity = create(:veracity, key: Assessment::VERACITY_UNTRUE)

    changes = {
      short_explanation: "Just short",
      explanation_slatejson: "{}",
      explanation_html: "<p>html</p>",
      veracity_id: veracity.id,
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

  test "admin should be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :admin)

    assert AssessmentAbility.new(user).can?(:read, assessment)
  end

  test "proofreader should be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :proofreader)

    assert AssessmentAbility.new(user).can?(:read, assessment)
  end

  test "social media manager should be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :social_media_manager)

    assert AssessmentAbility.new(user).can?(:read, assessment)
  end

  test "intern should not be authorized to view unapproved assessment evaluation when NOT evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)

    assert_not AssessmentAbility.new(user).can?(:read, assessment)
  end

  test "intern should be authorized to view unapproved assessment evaluation when evaluator" do
    assessment = create(:assessment, :being_evaluated)
    user = create(:user, :intern)
    assessment.update(evaluator: user)

    assert AssessmentAbility.new(user).can?(:read, assessment)
  end

  test "unauthenticated user should be authorized to view approved assessment evaluation" do
    assessment = create(:assessment, :approved)

    assert AssessmentAbility.new(nil).can?(:read, assessment)
  end

  test "unauthenticated user should not be authorized to view unapproved assessment evaluation" do
    assessment = create(:assessment, :being_evaluated)

    assert_not AssessmentAbility.new(nil).can?(:read, assessment)
  end

  test "any authenticated user should be authorized to view approved assessment evaluation" do
    assessment = create(:assessment, :approved)

    [:intern, :proofreader, :social_media_manager, :expert, :admin].each do |role|
      user = build(:user, role)

      assert AssessmentAbility.new(user).can?(:read, assessment), "#{role} doesn't have access"
    end
  end
end
