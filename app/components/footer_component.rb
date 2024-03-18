# frozen_string_literal: true

class FooterComponent < ViewComponent::Base
  attr_reader :tracking_cookies
  delegate :show_cookies_config?, :cookies_accepted?, :cookies_rejected?, to: :tracking_cookies

  def initialize(cookies:)
    @tracking_cookies = Cookies::TrackingCookies.new(cookies:)
  end
end
