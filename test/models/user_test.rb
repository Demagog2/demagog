# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "soft delete" do
    assert_discardable create(:user)
  end

  test "setting role_id replaces existing role" do
    user = create(:user, roles: [Role.find_by(key: Role::ADMIN)])

    user.role_id = Role.find_by(key: Role::EXPERT).id

    assert_equal 1, user.roles.size
    assert_equal Role::EXPERT, user.roles.first.key
  end

  test "#matching_name should search in unaccented version of the name" do
    user = create(:user, first_name: "Jiří", last_name: "Stříbrný")

    assert_equal(user, User.matching_name("jiri stribrny").first)
  end

  test "#matching_name should search in accented version of the name" do
    user = create(:user, first_name: "Jiří", last_name: "Stříbrný")

    assert_equal(user, User.matching_name("Jiří Stříbrný").first)
  end
end
