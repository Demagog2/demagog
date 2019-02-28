# frozen_string_literal: true

require "test_helper"

class ContentImageTest < ActiveSupport::TestCase
  test "soft delete" do
    assert_discardable create(:content_image)
  end
end
