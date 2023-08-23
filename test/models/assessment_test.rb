# frozen_string_literal: true

require "test_helper"

class AssessmentTest < ActiveSupport::TestCase
  def setup
    I18n.locale = :en
  end

  test "veracity new aliasing" do
    assert build(:assessment, :with_veracity_true).veracity_true?
    assert build(:assessment, :with_veracity_untrue).veracity_untrue?
    assert build(:assessment, :with_veracity_misleading).veracity_misleading?
    assert build(:assessment, :with_veracity_unverifiable).veracity_unverifiable?
  end

  test "veracity name" do
    assert_equal "True", build(:assessment, :with_veracity_true).veracity_name
    assert_equal "Untrue", build(:assessment, :with_veracity_untrue).veracity_name
    assert_equal "Misleading", build(:assessment, :with_veracity_misleading).veracity_name
    assert_equal "Unverifiable", build(:assessment, :with_veracity_unverifiable).veracity_name
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

  test "should not allow setting veracity on promise statement" do
    statement = create(:statement, :promise_statement)
    assessment = create(:assessment, :promise_assessment, :being_evaluated, statement:)
    veracity = create(:veracity)

    assessment.veracity = veracity

    assert_not assessment.valid?
    assert_equal ({ veracity: ["must be blank"] }), assessment.errors.messages
  end

  test "should not allow setting veracity new on promise statement" do
    statement = create(:statement, :promise_statement)
    assessment = create(:assessment, :promise_assessment, :being_evaluated, statement:)

    assessment.veracity_new = Assessment::VERACITY_UNVERIFIABLE

    assert_not assessment.valid?
    assert_equal ({ veracity_new: ["must be blank"] }), assessment.errors.messages
  end

  test "should not allow setting promise rating on factual statement" do
    statement = create(:statement)
    assessment = create(:assessment, :being_evaluated, statement:)

    assessment.promise_rating = PromiseRating.find_by(key: PromiseRating::FULFILLED)

    assert_not assessment.valid?
    assert_equal ({ promise_rating: ["must be blank"] }), assessment.errors.messages
  end
end
