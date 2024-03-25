# frozen_string_literal: true

module Schema::Workshops::Types
  class UpdateWorkshopError < Types::BaseObject
    field :message, String, null: false
  end
end
