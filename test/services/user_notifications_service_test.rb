# frozen_string_literal: true

require "test_helper"

class UserNotificationsServiceTest < ActiveSupport::TestCase
  def test_it_should_send_notifications_to_users_with_notify_on_statements_approval_flag_set_to_true
    statement = create(:statement, published: false)
    statement.published = true

    active_user = create(:user, notify_on_statement_publish: true, first_name: "John", last_name: "Publisher")
    interested_user = create(:user, notify_on_statement_publish: true)
    not_interested_user = create(:user, notify_on_statement_publish: false)

    UserNotificationService.new(statement: statement, current_user: active_user).run

    assert_no_notifications active_user
    assert_no_notifications not_interested_user

    assert_equal 1, Notification.where(recipient: interested_user).count

    notification = Notification.find_by(recipient: interested_user)
    assert_not_nil notification
    assert_equal statement, notification.statement
    assert_match "zveřejnil výrok", notification.statement_text
    assert_match "zveřejnil výrok", notification.full_text
  end

  private
    def assert_no_notifications(recipient)
      assert_equal 0, Notification.where(recipient: recipient).count, "User #{recipient} should not receive notifications"
    end
end
