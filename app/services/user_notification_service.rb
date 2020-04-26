# frozen_string_literal: true

class UserNotificationService
  # @param [Statement] statement
  # @param [User] current_user
  def initialize(statement:, current_user:)
    @statement = statement
    @current_user = current_user
  end

  def run
    if statement_published?
      notify_interested_users
    end
  end

  private
    def statement_published?
      @statement.published_changed? && @statement.published
    end

    def notify_interested_users
      # Get all interested users except for the current one
      interested_users = User.active.where(notify_on_statement_publish: true).where.not(id: @current_user.id)

      interested_users.each do |interested_user|
        notification = create_statement_changed_notification(interested_user)
        notification.save!
      end
    end

    def create_statement_changed_notification(interested_user)
      Notification.new(
        statement_text: "#{@current_user.display_in_notification} zveřejnil výrok",
        full_text: "#{@current_user.display_in_notification} zveřejnil výrok",
        statement_id: @statement.id,
        recipient: interested_user
      )
    end
end
