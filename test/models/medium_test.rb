# frozen_string_literal: true

require "test_helper"

class MediumTest < ActiveSupport::TestCase
  test "soft delete" do
    assert_discardable create(:medium)
  end

  test "matching name" do
    %w{Foo Bar}.each { |name| create(:medium, name: name) }

    assert_same Medium.matching_name("Ba").count, 1
  end
end
