# frozen_string_literal: true

require "test_helper"

class StatementTest < ActiveSupport::TestCase
  test "#published" do
    statements = Statement.published

    statements.each do |statement|
      assert_not_nil statement.correct_assessment.veracity
    end
  end

  test "#relevant_for_statistics" do
    statements = Statement.relevant_for_statistics

    statements.each do |statement|
      assert statement.count_in_statistics?
    end
  end
end
