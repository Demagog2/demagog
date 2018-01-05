# frozen_string_literal: true

require "test_helper"

class BodyTest < ActiveSupport::TestCase
  test "current members" do
    party_a = bodies(:body_a)

    # Total number of membership is 2
    assert_equal 2, party_a.memberships.count

    # Yet there is only single current member
    assert_equal 1, party_a.current_members.count
  end
end
