# frozen_string_literal: true

namespace :notification do
  desc "Email unread notifications"
  task :email_unread_notifications, [] => [:environment] do |task, args|
    # Make SQL queries part of the rake task output
    ActiveRecord::Base.logger = Logger.new STDOUT

    Notification.email_unread_notifications
  end
end
