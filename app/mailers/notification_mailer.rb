# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  def notification_email
    @notification = params[:notification]
    @host = ActionMailer::Base.default_url_options[:host]
    mail(to: @notification.recipient.email, subject: @notification.content)
  end
end
