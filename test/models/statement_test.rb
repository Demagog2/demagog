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
      assert_not_nil statement.approved_assessment.veracity_new
    end
  end

  test "ordered should return statements by source_order, then statement_transcript_position, and then excerpted_at" do
    source = create(:source)

    create(:statement, source:, content: "Second", source_order: 1)
    create(
      :statement,
      :with_transcript_position,
      source:,
      content: "Fourth",
      source_order: nil,
      transcript_position: [0, 22, 0, 40]
    )
    create(
      :statement,
      :with_transcript_position,
      source:,
      content: "Fifth",
      source_order: nil,
      transcript_position: [1, 4, 2, 10]
    )
    create(
      :statement,
      source:,
      content: "Seventh",
      source_order: nil,
      excerpted_at: Time.parse("2018-06-24 16:11:00")
    )
    create(
      :statement,
      source:,
      content: "Sixth",
      source_order: nil,
      excerpted_at: Time.parse("2018-06-24 16:08:00")
    )
    create(
      :statement,
      :with_transcript_position,
      source:,
      content: "Third",
      source_order: nil,
      transcript_position: [0, 0, 0, 10]
    )
    create(:statement, source:, content: "First", source_order: 0)

    ordered = source.statements.ordered

    assert_equal ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"], ordered.map { |s| s.content }
  end

  test "ordered should ignore important flag" do
    source = create(:source)

    create(:statement, :important, source:, content: "Second", source_order: 1)
    create(:statement, source:, content: "Third", source_order: 2)
    create(:statement, source:, content: "First", source_order: 0)

    ordered = source.statements.ordered

    assert_equal ["First", "Second", "Third"], ordered.map { |s| s.content }
  end

  test "published_important_first should return important first" do
    source = create(:source)

    create(:statement, :important, source:, content: "Important", source_order: 1)
    create(:statement, source:, content: "Second", source_order: 2)
    create(:statement, source:, content: "First", source_order: 0)

    list = source.statements.published_important_first

    assert_equal ["Important", "First", "Second"], list.map { |s| s.content }
  end
end
