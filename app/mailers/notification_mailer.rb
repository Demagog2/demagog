# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  default from: "Administrace Demagog.cz <noreply@demagog.cz>"

  def notification_email
    @notification = params[:notification]
    @host = ActionMailer::Base.default_url_options[:host]

    recipient = @notification.recipient
    email_with_name = "#{recipient.first_name} #{recipient.last_name} <#{recipient.email}>"

    mail(to: email_with_name, subject: @notification.statement_text)
  end
end
