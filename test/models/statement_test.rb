# frozen_string_literal: true

require "test_helper"

class StatementTest < ActiveSupport::TestCase
  test "soft delete" do
    assert_discardable create(:statement)
  end

  test "#published" do
    statements = Statement.published

    statements.each do |statement|
      assert statement.published
      assert_not_nil statement.approved_assessment.veracity
    end
  end

  test "#factual_and_published" do
    create(:statement)
    create(:statement, :promise_statement)

    statements = Statement.factual_and_published

    statements.each do |statement|
      assert_equal Statement::TYPE_FACTUAL, statement.statement_type
      assert statement.published
      assert_not_nil statement.approved_assessment.veracity
    end
  end

  test "#factual_and_relevant_for_statistics" do
    create(:statement)
    create(:statement, count_in_statistics: false)
    create(:statement, :promise_statement)

    statements = Statement.factual_and_relevant_for_statistics

    statements.each do |statement|
      assert_equal Statement::TYPE_FACTUAL, statement.statement_type
      assert statement.count_in_statistics?
    end
  end

  test "ordered should return statements by source_order, then statement_transcript_position, and then excerpted_at" do
    source = create(:source)

    create(:statement, source: source, content: "Second", source_order: 1)
    create(
      :statement,
      :with_transcript_position,
      source: source,
      content: "Fourth",
      source_order: nil,
      transcript_position: [0, 22, 0, 40]
    )
    create(
      :statement,
      :with_transcript_position,
      source: source,
      content: "Fifth",
      source_order: nil,
      transcript_position: [1, 4, 2, 10]
    )
    create(
      :statement,
      source: source,
      content: "Seventh",
      source_order: nil,
      excerpted_at: Time.parse("2018-06-24 16:11:00")
    )
    create(
      :statement,
      source: source,
      content: "Sixth",
      source_order: nil,
      excerpted_at: Time.parse("2018-06-24 16:08:00")
    )
    create(
      :statement,
      :with_transcript_position,
      source: source,
      content: "Third",
      source_order: nil,
      transcript_position: [0, 0, 0, 10]
    )
    create(:statement, source: source, content: "First", source_order: 0)

    ordered = source.statements.ordered

    assert_equal ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"], ordered.map { |s| s.content }
  end

  test "ordered should ignore important flag" do
    source = create(:source)

    create(:statement, :important, source: source, content: "Second", source_order: 1)
    create(:statement, source: source, content: "Third", source_order: 2)
    create(:statement, source: source, content: "First", source_order: 0)

    ordered = source.statements.ordered

    assert_equal ["First", "Second", "Third"], ordered.map { |s| s.content }
  end

  test "published_important_first should return important first" do
    source = create(:source)

    create(:statement, :important, source: source, content: "Important", source_order: 1)
    create(:statement, source: source, content: "Second", source_order: 2)
    create(:statement, source: source, content: "First", source_order: 0)

    list = source.statements.published_important_first

    assert_equal ["Important", "First", "Second"], list.map { |s| s.content }
  end

  test "admin should be authorized to change anything" do
    statement = create(:statement)
    user = create(:user, :admin)

    statement.assign_attributes(content: "Changed content", important: true)

    assert statement.is_user_authorized_to_save(user)
  end

  test "expert should be authorized to change anything" do
    statement = create(:statement)
    user = create(:user, :expert)

    statement.assign_attributes(content: "Changed content", important: true)

    assert statement.is_user_authorized_to_save(user)
  end

  test "social media manager should not be authorized to change anything" do
    statement = create(:statement)
    user = create(:user, :social_media_manager)

    statement.assign_attributes(content: "Changed content", important: true)

    assert_not statement.is_user_authorized_to_save(user)
  end

  test "proofreader should be authorized to change content when in unapproved state" do
    statement = create(:statement)
    statement.assessment.update(evaluation_status: Assessment::STATUS_BEING_EVALUATED)
    user = create(:user, :proofreader)

    statement.assign_attributes(content: "Changed content")

    assert statement.is_user_authorized_to_save(user)
  end

  test "proofreader should not be authorized to change non-text fields" do
    statement = create(:statement)
    statement.assessment.update(evaluation_status: Assessment::STATUS_BEING_EVALUATED)
    user = create(:user, :proofreader)

    statement.assign_attributes(important: true)

    assert_not statement.is_user_authorized_to_save(user)
  end

  test "intern should be authorized to edit content of statement they are evaluating" do
    statement = create(:statement)
    user = create(:user, :intern)
    statement.assessment.update(
      evaluation_status: Assessment::STATUS_BEING_EVALUATED,
      evaluator: user
    )

    statement.assign_attributes(content: "Changed content")

    assert statement.is_user_authorized_to_save(user)
  end

  test "intern should not be authorized to edit content of statement they are not evaluating" do
    statement = create(:statement)
    user = create(:user, :intern)
    statement.assessment.update(evaluation_status: Assessment::STATUS_BEING_EVALUATED,)

    statement.assign_attributes(content: "Changed content")

    assert_not statement.is_user_authorized_to_save(user)
  end
end
