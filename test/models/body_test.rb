# frozen_string_literal: true

require "test_helper"

class BodyTest < ActiveSupport::TestCase
  def test_members_total_count
    assert_equal 2, party.memberships.count
  end

  def test_current_members_count
    assert_equal 1, party.current_members.count
  end

  private
    def party
      create(:party, member_count: 2) do |party|
        membership = party.memberships.last
        membership.until = 1.day.ago
        membership.save
      end
    end
end
