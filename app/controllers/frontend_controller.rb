# frozen_string_literal: true

class FrontendController < ApplicationController
  protected
    def set_locale
      # Whole app is using English except frontend which we want to
      # have with proper Czech localized dates and pagination
      I18n.locale = :cs
    end
end
