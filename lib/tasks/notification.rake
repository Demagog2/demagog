# frozen_string_literal: true

namespace :notification do
  email_unread_notifications_desc = <<-DESC.gsub(/    /, "")
    Send unread notifications by email
      $ rake notification:email_unread_notifications
  DESC
  desc email_unread_notifications_desc
  task :email_unread_notifications, [] => [:environment] do |task, args|
    # Make SQL queries part of the rake task output
    ActiveRecord::Base.logger = Logger.new STDOUT

    Notification.email_unread_notifications
  end

  email_unread_notifications_async_desc = <<-DESC.gsub(/    /, "")
    Queue sidekiq job, which sends unread notifications by email
      $ rake notification:email_unread_notifications_async
  DESC
  desc email_unread_notifications_async_desc
  task :email_unread_notifications_async, [] => [:environment] do |task, args|
    EmailUnreadNotificationsWorker.perform_async
  end
end
