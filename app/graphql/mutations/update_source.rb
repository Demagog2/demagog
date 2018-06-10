# frozen_string_literal: true

Mutations::UpdateSource = GraphQL::Field.define do
  name "UpdateSource"
  type Types::SourceType
  description "Update existing source"

  argument :id, !types.Int
  argument :source_input, !Types::SourceInputType

  resolve -> (obj, args, ctx) {
    raise Errors::AuthenticationNeededError.new unless ctx[:current_user]

    source = args[:source_input].to_h

    source["speakers"] = source["speakers"].map do |speaker_id|
      Speaker.find(speaker_id)
    end

    Source.update(args[:id], source)
  }
end
