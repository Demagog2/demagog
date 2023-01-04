# frozen_string_literal: true

module Mutations
  class MarkUnreadNotificationsAsRead < GraphQL::Schema::Mutation
    description "Mark unread notifications of current user as read, either all or just regarding one statement"

    field :notifications, [Types::NotificationType], null: false

    argument :statement_id, ID, required: false

    def resolve(statement_id: nil)
      Utils::Auth.authenticate(context)

      notifications = statement_id.nil? ?
        Notification.mark_all_unread_as_read(context[:current_user])
        : Notification.mark_statement_unread_as_read(statement_id, context[:current_user])

      { notifications: }
    end
  end
end
