# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user && @user.persisted?
      sign_in_and_redirect @user, event: :authentication, after_sign_in_path_for: admin_path
    else
      flash[:alert] = I18n.t "devise.omniauth_callbacks.failure", kind: "Google", reason: "User not found"
      redirect_to admin_path
    end
  end
end
