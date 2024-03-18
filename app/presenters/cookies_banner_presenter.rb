# frozen_string_literal: true

class CookiesBannerPresenter
  attr_accessor :show_cookies_banner

  def initialize(cookies)
    # TODO: Refactor further
    @show_cookies_banner = !Cookies::TrackingCookies.new(cookies:).show_cookies_config?
  end
end
