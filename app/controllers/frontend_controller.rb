# frozen_string_literal: true

class FrontendController < ApplicationController
  before_action :set_public_expiration

  protected
    def set_locale
      # Whole app is using English except frontend which we want to
      # have with proper Czech localized dates and pagination
      I18n.locale = :cs
    end

    def set_public_expiration
      expires_in 10.minutes, public: true
    end
end
