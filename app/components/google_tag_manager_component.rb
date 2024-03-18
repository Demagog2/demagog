# frozen_string_literal: true

class GoogleTagManagerComponent < ViewComponent::Base
  def initialize(cookies:, iframe: false)
    @tracking_cookies = Cookies::TrackingCookies.new(cookies:)
    @iframe = iframe
  end

  def include_tracking_on_the_page?
    google_tag_manager_id.present? && @tracking_cookies.cookies_accepted?
  end

  def google_tag_manager_id
    ENV.fetch("GOOGLE_TAG_MANAGER_KEY") { nil }
  end

  def embed_as_iframe?
    @iframe
  end
end
