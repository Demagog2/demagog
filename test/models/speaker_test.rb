# frozen_string_literal: true

require "test_helper"

class SpeakerTest < ActiveSupport::TestCase
  test "#full_name" do
    assert_equal "John Doe", speakers(:one).full_name
    assert_equal "Jane Doe", speakers(:two).full_name
  end

  test "#portrait" do
    speaker = speakers(:one)

    assert_not_nil speaker.attachment
    assert_same(speaker.attachment, speaker.portrait)
  end

  test "#party" do
    speaker = speakers(:one)

    assert_equal(speaker.party, parties(:party_a))
  end

  test "#stats" do
    speaker = speakers(:one)

    assert_equal({ true: 1, untrue: 1, misleading: 0, unverifiable: 0 }, speaker.stats)
  end

  test "#stats_for_debate" do
    speaker = speakers(:one)

    assert_equal({ true: 1, untrue: 0, misleading: 0, unverifiable: 0 },
      speaker.stats_for_debate(sources(:one)))
  end

  test "#statements_by_veracity" do
    speaker = speakers(:one)

    assert_equal([statements(:one), statements(:fake_statement)], speaker.statements_by_veracity(veracities(:one)).to_a)
    assert_equal([statements(:two)], speaker.statements_by_veracity(veracities(:two)).to_a)
  end
end
