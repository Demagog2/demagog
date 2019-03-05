# frozen_string_literal: true

class Admin::AdminController < ApplicationController
  layout "admin"

  def index
  end

  def policy
  end

  def become_another_user
    return head :not_found unless current_user && current_user.role.permissions.include?("admin:become-another-user")

    sign_in(:user, User.find(params[:id]))

    redirect_to "/admin"
  end

  def test_login
    # Make sure it is not runnable in production
    return head :not_found if Rails.env.production?

    sign_in(:user, User.find(params[:id]))

    head :ok
  end
end
