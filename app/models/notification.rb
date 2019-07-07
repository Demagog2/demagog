# frozen_string_literal: true

class Notification < ApplicationRecord
  belongs_to :recipient, class_name: "User"
  belongs_to :statement

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
      .joins(:statement)
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

  def self.mark_all_unread_as_read(current_user)
    unread_notifications_ids = current_user.notifications.where(read_at: nil).pluck(:id)

    notifications = current_user.notifications.where(id: unread_notifications_ids)
    notifications.update_all(read_at: Time.now)
    notifications
  end

  def self.mark_statement_unread_as_read(statement_id, current_user)
    unread_notifications_ids = current_user.notifications.where(read_at: nil, statement_id: statement_id).pluck(:id)

    notifications = current_user.notifications.where(id: unread_notifications_ids)
    notifications.update_all(read_at: Time.now)
    notifications
  end

  def self.get(user, include_read = true)
    # The join to statement makes sure that the statement exists and is not marked as deleted
    notifications = user.notifications.joins(:statement)

    notifications = notifications.where(read_at: nil) unless include_read

    notifications
  end
end
