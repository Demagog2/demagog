# frozen_string_literal: true

require "test_helper"

class StatementAbilityTest < ActiveSupport::TestCase
  test "admin should be authorized to change anything" do
    statement = create(:statement)
    user = create(:user, :admin)

    changes = {
      content: "Changed content",
      important: true
    }

    assert StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "expert should be authorized to change anything" do
    statement = create(:statement)
    user = create(:user, :expert)

    changes = {
      content: "Changed content",
      important: true
    }

    assert StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "social media manager should not be authorized to change anything" do
    statement = create(:statement)
    user = create(:user, :social_media_manager)

    changes = {
      content: "Changed content",
      important: true
    }

    assert_not StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "proofreader should be authorized to change anything" do
    statement = create(:statement)
    statement.assessment.update(evaluation_status: Assessment::STATUS_BEING_EVALUATED)
    user = create(:user, :proofreader)

    changes = {
      content: "Changed content",
      important: true
    }

    assert StatementAbility.new(user).can?(:update, statement, changes)
  end

  # test "proofreader should not be authorized to change non-text fields" do
  #   statement = create(:statement)
  #   statement.assessment.update(evaluation_status: Assessment::STATUS_BEING_EVALUATED)
  #   user = create(:user, :proofreader)

  #   statement.assign_attributes(important: true)

  #   assert_not StatementAbility.new(user).can?(:update, statement, changes)
  # end

  test "intern should be authorized to edit content of statement they are evaluating" do
    statement = create(:statement)
    user = create(:user, :intern)
    statement.assessment.update(
      evaluation_status: Assessment::STATUS_BEING_EVALUATED,
      evaluator: user
    )

    changes = {
      content: "Changed content",
    }

    assert StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "intern should not be authorized to edit content of statement that is not in being evaluated state" do
    statement = create(:statement)
    user = create(:user, :intern)
    statement.assessment.update(
      evaluation_status: Assessment::STATUS_PROOFREADING_NEEDED,
      evaluator: user
    )

    changes = {
      content: "Changed content",
    }

    assert_not StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "intern should not be authorized to edit every attribute of statement they are evaluating" do
    statement = create(:statement, :unpublished)
    user = create(:user, :intern)
    statement.assessment.update(
      evaluation_status: Assessment::STATUS_BEING_EVALUATED,
      evaluator: user
    )

    changes = {
      published: true
    }

    assert_not StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "intern should not be authorized to edit content of statement they are not evaluating" do
    statement = create(:statement)
    user = create(:user, :intern)
    statement.assessment.update(evaluation_status: Assessment::STATUS_BEING_EVALUATED,)

    changes = {
      content: "Changed content",
    }

    assert_not StatementAbility.new(user).can?(:update, statement, changes)
  end

  test "social media manager should be authorized to edit content of statement they are evaluating" do
    statement = create(:statement)
    user = create(:user, :social_media_manager)
    statement.assessment.update(
      evaluation_status: Assessment::STATUS_BEING_EVALUATED,
      evaluator: user
    )

    changes = {
      content: "Changed content",
    }

    assert StatementAbility.new(user).can?(:update, statement, changes)
  end
end
