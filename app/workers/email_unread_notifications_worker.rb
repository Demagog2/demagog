# frozen_string_literal: true

class EmailUnreadNotificationsWorker
  include Sidekiq::Worker

  def perform
    Notification.email_unread_notifications
  end
end
