# frozen_string_literal: true

class PortraitComponent < ViewComponent::Base
  def initialize(speaker:, lazy_loaded: false)
    @speaker = speaker
    @lazy_loaded = lazy_loaded
  end

  def speaker_presenter
    SpeakerPresenter.new(@speaker)
  end
end
