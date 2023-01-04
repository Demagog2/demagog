# frozen_string_literal: true

require "test_helper"

class SpeakerStatTest < ActiveSupport::TestCase
  test "it returns correct stats" do
    speaker = create(:speaker)
    source_speaker = create(:source_speaker, speaker:)
    source =
      create(
        :source,
        source_speakers: [source_speaker],
        statements: [create(:statement, source_speaker:), create(:statement, source_speaker:), create(:statement, source_speaker:)]
      )
    segment = create(:article_segment_source_statements, source:)
    create(:fact_check, segments: [segment])

    expected_stats = {
      true: 3,
      untrue: 0,
      unverifiable: 0,
      misleading: 0
    }

    assert_equal(expected_stats, SpeakerStat.where(speaker_id: speaker.id).normalize)
  end
end
