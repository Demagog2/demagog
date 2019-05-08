# frozen_string_literal: true

require "test_helper"

class SpeakerStatTest < ActiveSupport::TestCase
  test "it returns correct stats" do
    speaker = create(:speaker)

    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    assert_equal(expected_stats, SpeakerStat.where(speaker_id: speaker.id).normalize)
  end
end
