# frozen_string_literal: true

Types::MediumType = GraphQL::ObjectType.define do
  name "Medium"

  field :id, !types.ID
  field :name, !types.String

  field :personalities, !types[!Types::MediaPersonalityType] do
    resolve -> (obj, args, ctx) {
      obj.media_personalities.order(name: :asc)
    }
  end
end
