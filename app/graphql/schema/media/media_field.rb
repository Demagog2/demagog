# frozen_string_literal: true

module Schema::Media::MediaField
  extend ActiveSupport::Concern

  included do
    field :media, [Types::MediumType], null: false do
      argument :name, GraphQL::Types::String, required: false
    end

    def media(name: nil)
      media = Medium.order(name: :asc)

      name ? media.matching_name(name) : media
    end
  end
end
