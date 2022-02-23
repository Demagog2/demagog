# frozen_string_literal: true

class PlausibleioAnalyticsPresenter
  def initialize
  end

  def enabled_tracking_code
    Rails.env.production?
  end
end
