# frozen_string_literal: true

require "test_helper"

class SpeakerTest < ActiveSupport::TestCase
  test "#full_name" do
    assert_equal "John Doe", build(:speaker).full_name
  end

  test "#body" do
    speaker = create(:speaker_with_party)
    body = speaker.memberships.first.body

    assert_equal(speaker.body, body)
  end

  test "generating slugs" do
    speaker = create(:speaker)

    assert_equal "#{speaker.first_name.downcase}-#{speaker.last_name.downcase}-#{speaker.id}", speaker.slug
  end
end
