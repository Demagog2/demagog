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
end
