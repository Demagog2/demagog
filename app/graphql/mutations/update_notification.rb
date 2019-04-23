# frozen_string_literal: true

module Mutations
  class UpdateNotification < GraphQL::Schema::Mutation
    description "Update existing notification"

    field :notification, Types::NotificationType, null: false

    argument :id, ID, required: true
    argument :input, Types::UpdateNotificationInputType, required: true

    def resolve(id:, input:)
      Utils::Auth.authenticate(context)

      notification = Notification.find(id)

      if notification.recipient.id != context[:current_user].id
        raise Errors::NotAuthorizedError.new
      end

      notification.update!(input.to_h)

      { notification: notification }
    end
  end
end
