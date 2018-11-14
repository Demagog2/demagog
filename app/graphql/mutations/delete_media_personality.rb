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
      MediaPersonality.update(id, deleted_at: Time.now)

      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
