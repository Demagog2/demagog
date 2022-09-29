# frozen_string_literal: true

require "test_helper"

class RoleTest < ActiveSupport::TestCase
  test "returns true if specific role has given permission" do
    role = create(:role, :social_media_manager)

    assert role.authorized?("speakers:edit")
  end

  test "returns false if specific role has not given permission" do
    role = create(:role, :intern)

    assert_not role.authorized?("speakers:edit")
  end
end
