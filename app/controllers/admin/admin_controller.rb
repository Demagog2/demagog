# frozen_string_literal: true

class Admin::AdminController < ApplicationController
  layout "admin"

  def index
  end

  def become_another_user
    return head :not_found unless current_user && current_user.role.permissions.include?("admin:become-another-user")

    sign_in(:user, User.find(params[:id]))

    redirect_to "/admin"
  end
end
