# frozen_string_literal: true

module Schema::Workshops::Types
  class WorkshopType < Types::BaseObject
    include ActionView::Helpers::NumberHelper

    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: false
    field :price, Int, null: false
    field :price_formatted, String, null: false
    field :image, String, null: true

    def image(size: nil)
      return nil unless object.image.attached?

      Rails.application.routes.url_helpers.polymorphic_url(object.image, only_path: true)
    end

    def price_formatted
      number_to_currency(object.price, unit: "Kč", precision: 0, separator: ",", delimiter: ".")
    end
  end
end
