# frozen_string_literal: true

class SpeakerPresenter
  def initialize(speaker_attribute)
    @speaker = (speaker_attribute.is_a? Speaker) ? speaker_attribute : nil
    @source_speaker = (speaker_attribute.is_a? SourceSpeaker) ? speaker_attribute : nil
  end

  def has_portrait?
    (@source_speaker ? @source_speaker.speaker : @speaker).avatar.attached?
  end

  def portrait_url(size: nil)
    avatar = (@source_speaker ? @source_speaker.speaker : @speaker).avatar

    case size
    when :small, :detail
      avatar.variant(size).processed.url
    else
      avatar
    end
  end

  def portrait_speaker
    @source_speaker || @speaker
  end

  def speaker
    @source_speaker ? @source_speaker.speaker : @speaker
  end

  def full_name
    @source_speaker ? @source_speaker.full_name : @speaker.full_name
  end

  def role
    @source_speaker ? @source_speaker.role : @speaker.role
  end

  def has_body?
    body = @source_speaker ? @source_speaker.body : @speaker.body

    !!body
  end

  def body_short_name
    body = @source_speaker ? @source_speaker.body : @speaker.body

    body ? body.short_name : nil
  end
end
