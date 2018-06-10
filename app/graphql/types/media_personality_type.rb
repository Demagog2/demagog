# frozen_string_literal: true

Types::MediaPersonalityType = GraphQL::ObjectType.define do
  name "MediaPersonality"

  field :id, !types.ID
  field :name, !types.String

  field :media, !types[!Types::MediumType] do
    resolve -> (obj, args, ctx) {
      obj.media.order(name: :asc)
    }
  end
end
