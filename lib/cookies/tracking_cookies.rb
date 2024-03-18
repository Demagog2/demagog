# frozen_string_literal: true

module Cookies
  class TrackingCookies
    COOKIES_RESPONSES = [
      COOKIES_ACCEPTED = "accept",
      COOKIES_REJECTED = "reject"
    ].freeze

    def initialize(cookies:)
      @cookies = cookies
    end

    def show_cookies_config?
      COOKIES_RESPONSES.include?(@cookies[:demagogcz_analytics_cookies])
    end

    def cookies_accepted?
      @cookies.fetch(:demagogcz_analytics_cookies) == COOKIES_ACCEPTED
    end

    def cookies_rejected?
      @cookies.fetch(:demagogcz_analytics_cookies) == COOKIES_REJECTED
    end
  end
end
