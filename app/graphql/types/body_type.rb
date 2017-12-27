# frozen_string_literal: true

Types::BodyType = GraphQL::ObjectType.define do
  name "Body"

  field :id, !types.ID
  field :name, !types.String
  field :short_name, !types.String
  field :description, !types.String
  field :is_party, !types.Boolean

  # TODO: Attachment
  field :members, !types[Types::SpeakerType] do
    argument :limit, types.Int, default_value: 10
    argument :offset, types.Int, default_value: 0

    resolve ->(obj, args, ctx) {
      obj.current_members.limit(args[:limit]).offset(args[:offset])
    }
  end
end
