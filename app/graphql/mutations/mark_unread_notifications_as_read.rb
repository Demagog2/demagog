# frozen_string_literal: true

module Mutations
  class MarkUnreadNotificationsAsRead < GraphQL::Schema::Mutation
    description "Mark all unread notifications of current user as read"

    field :notifications, [Types::NotificationType], null: false

    def resolve
      Utils::Auth.authenticate(context)

      notifications = Notification.mark_unread_as_read(context[:current_user])

      { notifications: notifications }
    end
  end
end
