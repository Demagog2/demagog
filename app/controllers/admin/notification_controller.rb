# frozen_string_literal: true

class Admin::NotificationController < ApplicationController
  before_action :authenticate_user!

  def open
    notification = Notification.find(params[:id])
    return head :not_found unless current_user.id == notification.recipient.id

    if notification.read_at.nil?
      notification.update!(read_at: Time.now)
    end

    redirect_to notification.action_link
  end
end
