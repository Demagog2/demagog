# frozen_string_literal: true

class SpeakerListItemComponent < ViewComponent::Base
  def initialize(speaker:)
    @speaker = speaker
  end
end
