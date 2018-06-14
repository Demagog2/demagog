# frozen_string_literal: true

Mutations::DeleteSource = GraphQL::Field.define do
  name "DeleteSource"
  type !types.ID
  description "Delete existing source with all its statements"

  argument :id, !types.ID

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    id = args[:id].to_i

    begin
      Source.transaction do
        source = Source.update(id, deleted_at: Time.now)
        source.statements.update_all(deleted_at: Time.now)
      end

      id
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new(e.to_s)
    end
  }
end
