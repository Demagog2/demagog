# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :recipient, class_name: "User"

  def self.create_notifications(notifications, current_user)
    # We don't need to notify current user
    already_notified = [current_user]

    Notification.transaction do
      notifications.each do |notification|
        next if already_notified.include?(notification.recipient)

        notification.save!

        already_notified << notification.recipient
      end
    end
  end

  def self.email_unread_notifications
    unread_notifications = Notification
      .joins(:recipient)
      .where(read_at: nil)
      .where("notifications.created_at > ?", Time.now - 15.minutes)
      .where(emailed_at: nil)
      .where(users: { email_notifications: true })
      .includes(:recipient)

    unread_notifications.each do |notification|
      puts "Sending notification #{notification.id} to #{notification.recipient.email}"

      NotificationMailer.with(notification: notification).notification_email.deliver_now

      notification.update!(emailed_at: Time.now)
    end
  end
end
