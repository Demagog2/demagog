# frozen_string_literal: true

class PortraitComponent < ViewComponent::Base
  def initialize(speaker:, lazy_loaded: false, size: nil)
    @speaker = speaker
    @lazy_loaded = lazy_loaded
    @size = size
  end

  def speaker_presenter
    SpeakerPresenter.new(@speaker)
  end
end
