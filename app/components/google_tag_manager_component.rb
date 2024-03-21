# frozen_string_literal: true

class GoogleTagManagerComponent < ViewComponent::Base
  def initialize(cookies:, iframe: false)
    @tracking_cookies = Cookies::TrackingCookies.new(cookies:)
    @iframe = iframe
  end

  def google_tag_manager_enabled?
    google_tag_manager_id.present?
  end

  def cookie_consent_given?
    @tracking_cookies.cookies_accepted?
  end

  def google_tag_manager_id
    ENV.fetch("GOOGLE_TAG_MANAGER_KEY") { nil }
  end

  def embed_as_iframe?
    @iframe
  end
end
