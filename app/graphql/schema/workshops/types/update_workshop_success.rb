# frozen_string_literal: true

module Schema::Workshops::Types
  class UpdateWorkshopSuccess < Types::BaseObject
    field :workshop, WorkshopType, null: false
  end
end
