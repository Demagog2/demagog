# frozen_string_literal: true

require "test_helper"

class StatementTest < ActiveSupport::TestCase
  test "#published" do
    statements = Statement.published

    statements.each do |statement|
      assert_not_nil statement.correct_assessment.veracity
    end
  end
end
