# frozen_string_literal: true

class YouTubeVideoModalComponent < ViewComponent::Base
  def initialize(video_code:, modal_id:)
    @video_code = video_code
    @modal_id = modal_id
  end
end
