# frozen_string_literal: true

require "test_helper"

class GovernmentPromisesEvaluationTest < ActiveSupport::TestCase
  def subject(source_ids: [], assessment_methodology: build(:assessment_methodology, :promises_latest))
    article = create(:article, :government_promises_evaluation, assessment_methodology:)

    source_ids.each do |source_id|
      create(:article_segment_source_statements, source_id:, article:)
    end

    GovernmentPromisesEvaluation.new(article:)
  end

  test "promise count is zero by default" do
    assert_equal 0, subject.promise_count
  end

  test "promise count is equal to number of assessed published promises" do
    source = create(:source)
    create_list(:statement, 3, :promise_statement, source:)
    create_list(:statement, 3, :promise_statement, :unpublished, source:)
    create_list(:statement, 3, source:)

    assert_equal 3, subject(source_ids: [source.id]).promise_count
  end

  test "promise count can be calculated from multiple sources" do
    source_a = create(:source)
    create_list(:statement, 3, :promise_statement, source: source_a)

    source_b = create(:source)
    create_list(:statement, 3, :promise_statement, source: source_b)

    assert_equal 6, subject(source_ids: [source_a.id, source_b.id]).promise_count
  end

  test "returns stats based on the assessment methodology" do
    assert_equal([{ key: "fulfilled", count: 0, percentage: 0 }, { key: "partially_fulfilled", count: 0, percentage: 0 }, { key: "broken", count: 0, percentage: 0 }], subject(source_ids: [], assessment_methodology: build(:assessment_methodology, :promises_legacy)).stats)
    assert_equal([{ key: "fulfilled", count: 0, percentage: 0 }, { key: "in_progress", count: 0, percentage: 0 }, { key: "broken", count: 0, percentage: 0 }, { key: "stalled", count: 0, percentage: 0 }], subject(source_ids: [], assessment_methodology: build(:assessment_methodology, :promises_latest)).stats)
  end

  test "returns number of fulfilled promises" do
    source = create(:source)
    create_list(:statement, 10, :promise_statement, source:)
    create_list(:statement, 3, :promise_statement, :unpublished, source:)

    stats = subject(source_ids: [source.id]).stats[0]

    assert_equal 10, stats[:count]
    assert_equal 100, stats[:percentage]
  end
end