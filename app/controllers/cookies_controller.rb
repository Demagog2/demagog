# frozen_string_literal: true

class CookiesController < FrontendController
  skip_before_action :verify_authenticity_token

  def analytics
    decision = params[:decision]

    if !decision.nil? && (decision == "accept" || decision == "reject")
      cookies.permanent[:demagogcz_analytics_cookies] = {
        value: decision,
        domain: :all
      }

      return head :no_content
    end

    head :bad_request
  end
end
