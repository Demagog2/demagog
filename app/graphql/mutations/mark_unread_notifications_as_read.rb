# frozen_string_literal: true

Mutations::MarkUnreadNotificationsAsRead = GraphQL::Field.define do
  name "MarkUnreadNotificationsAsRead"
  type types[!Types::NotificationType]
  description "Mark all unread notifications of current user as read"

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)

    Notification.mark_unread_as_read(ctx[:current_user])
  }
end
