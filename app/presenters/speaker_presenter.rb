# frozen_string_literal: true

class SpeakerPresenter
  def initialize(speaker_attribute)
    @speaker = (speaker_attribute.is_a? Speaker) ? speaker_attribute : nil
    @source_speaker = (speaker_attribute.is_a? SourceSpeaker) ? speaker_attribute : nil
  end

  def has_portrait?
    (@source_speaker ? @source_speaker.speaker : @speaker).avatar.attached?
  end

  def portrait_url
    (@source_speaker ? @source_speaker.speaker : @speaker).avatar.url
  end

  def portrait_speaker
    @source_speaker ? @source_speaker : @speaker
  end

  def speaker_id
    @source_speaker ? @source_speaker.speaker_id : @speaker.id
  end

  def full_name
    @source_speaker ? @source_speaker.full_name : @speaker.full_name
  end
end
