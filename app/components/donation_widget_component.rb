# frozen_string_literal: true

class DonationWidgetComponent < ViewComponent::Base
  def initialize(options = {})
    @class = options[:class]
    @token = options[:token]
  end
end
