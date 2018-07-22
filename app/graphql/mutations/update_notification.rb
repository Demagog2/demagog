# frozen_string_literal: true

Mutations::UpdateNotification = GraphQL::Field.define do
  name "UpdateNotification"
  type Types::NotificationType
  description "Update notification"

  argument :id, !types.ID
  argument :input, !Types::UpdateNotificationInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)

    notification = Notification.find(args[:id])

    if notification.recipient.id != ctx[:current_user].id
      raise Errors::NotAuthorizedError.new
    end

    notification.update!(args[:input].to_h)

    notification
  }
end
