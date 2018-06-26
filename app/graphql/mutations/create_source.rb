# frozen_string_literal: true

Mutations::CreateSource = GraphQL::Field.define do
  name "CreateSource"
  type Types::SourceType
  description "Add new source"

  argument :source_input, !Types::SourceInputType

  resolve -> (obj, args, ctx) {
    Utils::Auth.authenticate(ctx)
    Utils::Auth.authorize(ctx, ["sources:edit"])

    source = args[:source_input].to_h

    source["speakers"] = source["speakers"].map do |speaker_id|
      Speaker.find(speaker_id)
    end

    Source.create!(source)
  }
end
