# frozen_string_literal: true

require "test_helper"

class SpeakerListItemComponentTest < ViewComponent::TestCase
  def test_component_renders_something_useful
    speaker = build(:speaker)

    render_inline(SpeakerListItemComponent.new(speaker: speaker))

    assert_text(speaker.full_name)
  end
end
