# frozen_string_literal: true

class FooterPresenter
  attr_accessor :show_cookies_config, :analytics_cookies

  def initialize(cookies)
    @show_cookies_config = ["accept", "reject"].include?(cookies[:demagogcz_analytics_cookies])
    @analytics_cookies = cookies[:demagogcz_analytics_cookies]
  end
end
