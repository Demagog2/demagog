# frozen_string_literal: true

class GoogleAnalyticsPresenter
  attr_accessor :tracking_id

  def initialize
    @tracking_id = ENV.fetch("GOOGLE_TAG_MANAGER_ID", nil)
  end

  def enabled_tracking_code
    !!@tracking_id && Rails.env.production?
  end
end
