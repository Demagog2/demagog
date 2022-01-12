# frozen_string_literal: true

class GoogleAnalyticsPresenter
  attr_accessor :tracking_id

  def initialize
    @tracking_id = ENV.fetch("GOOGLE_ANALYTICS_TRACKING_ID", nil)
  end

  def enabled_tracking_code
    !!@tracking_id && Rails.env.production?
  end
end
