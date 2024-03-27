# frozen_string_literal: true

module Schema::Workshops::Types
  class DeleteWorkshopSuccess < Types::BaseObject
    field :id, ID, null: false
  end
end
