# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "setting role_id replaces existing role" do
    user = create(:user, roles: [Role.find_by(key: Role::ADMIN)])

    user.role_id = Role.find_by(key: Role::EXPERT).id

    assert_equal 1, user.roles.size
    assert_equal Role::EXPERT, user.roles.first.key
  end
end
