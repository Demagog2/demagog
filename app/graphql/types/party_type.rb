# frozen_string_literal: true

module Types
  class PartyType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :short_name, String, null: true
    field :description, String, null: false

    # TODO: Attachment
    field :members, [Types::SpeakerType], null: false do
      argument :limit, Int, default_value: 10, required: false
      argument :offset, Int, default_value: 0, required: false
    end

    def members(args)
      object.current_members.limit(args[:limit]).offset(args[:offset])
    end
  end
end

