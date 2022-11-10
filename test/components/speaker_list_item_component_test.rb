# frozen_string_literal: true

require "test_helper"

class SpeakerListItemComponentTest < ViewComponent::TestCase
  def test_component_renders_something_useful
    render_inline(SpeakerListItemComponent.new(speaker: build(:speaker)))
  end
end
