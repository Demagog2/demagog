# frozen_string_literal: true

class CookiesBannerPresenter
  attr_accessor :show_cookies_banner

  def initialize(cookies)
    @show_cookies_banner = !["accept", "reject"].include?(cookies[:demagogcz_analytics_cookies])
  end
end
