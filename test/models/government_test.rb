# frozen_string_literal: true

require "test_helper"

class GovernmentTest < ActiveSupport::TestCase
  test "has ministers" do
    government = build(:government, ministers: [build(:minister)])

    assert_equal 1, government.ministers.length
  end
end
