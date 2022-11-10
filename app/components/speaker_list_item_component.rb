# frozen_string_literal: true

class SpeakerListItemComponent < ViewComponent::Base
  include ApplicationHelper

  def initialize(speaker:)
    @speaker = speaker
  end
end
