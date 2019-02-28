# frozen_string_literal: true

require "test_helper"

class PageTest < ActiveSupport::TestCase
  test "soft delete" do
    assert_discardable create(:page)
  end
end
