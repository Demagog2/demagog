# frozen_string_literal: true

module Schema::Workshops::Types
  class CreateWorkshopError < Types::BaseObject
    field :message, String, null: false
  end
end
