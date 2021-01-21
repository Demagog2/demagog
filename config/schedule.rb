# frozen_string_literal: true

# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

# Because passing environment via -e param does not work in rails 6, see https://github.com/javan/whenever/issues/810
set :bundle_command, "RAILS_ENV=#{ENV["RAILS_ENV"]} bundle exec"

every 5.minutes do
  runner "Notification.email_unread_notifications"
end

every 1.day, at: "3:00 am" do
  rake "elasticsearch:reindex"
end
