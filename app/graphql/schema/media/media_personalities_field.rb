# frozen_string_literal: true

module Schema::Media::MediaPersonalitiesField
  extend ActiveSupport::Concern

  included do
    field :media_personalities, [Types::MediaPersonalityType], null: false do
      argument :name, String, required: false
    end

    def media_personalities(**args)
      media_personalities = MediaPersonality.order(name: :asc)

      args[:name] ? media_personalities.matching_name(args[:name]) : media_personalities
    end
  end
end
