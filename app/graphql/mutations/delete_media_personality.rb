# frozen_string_literal: true

Mutations::DeleteMediaPersonality = GraphQL::Field.define do
  name "DeleteMediaPersonality"
  type !types.ID
  description "Delete existing media personality"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    id = args[:id].to_i

    begin
      MediaPersonality.delete_media_personality(id)

      id
    rescue ActiveRecord::RecordNotFound, ActiveModel::ValidationError => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
