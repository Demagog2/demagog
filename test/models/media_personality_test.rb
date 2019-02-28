# frozen_string_literal: true

require "test_helper"

class MediaPersonalityTest < ActiveSupport::TestCase
  test "soft deletes" do
    assert_discardable create(:media_personality)
  end
end
