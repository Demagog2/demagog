# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :ensure_user_is_active
  before_action :set_raven_context
  protect_from_forgery with: :exception

  def menu_items
    MenuItem.order(order: :asc)
  end

  protected
    def after_sign_in_path_for(resource)
      request.env["omniauth.origin"] || stored_location_for(resource) || admin_path
    end

    def after_sign_out_path_for(resource)
      admin_path
    end

    def ensure_user_is_active
      # Make sure that we sign out the deactivated user if they are still logged in
      if current_user && !current_user.active
        sign_out
      end
    end

    def set_raven_context
      Raven.user_context(id: current_user.id, email: current_user.email) if user_signed_in?
      Raven.extra_context(params: params.to_unsafe_h, url: request.url)
    end
end
