# frozen_string_literal: true

module Schema::Workshops::WorkshopsField
  extend ActiveSupport::Concern

  included do
    field :workshop, Schema::Workshops::Types::WorkshopType, null: true do
      argument :id, GraphQL::Types::ID, required: true
    end

    def workshop(id:)
      Workshop.find_by(id:)
    end

    field :workshops, Schema::Workshops::Types::WorkshopType.connection_type, null: false

    def workshops
      Workshop.order(created_at: :desc)
    end
  end
end
