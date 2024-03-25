# frozen_string_literal: true

module Schema::Workshops::Inputs
  class UpdateWorkshopInput < GraphQL::Schema::InputObject
    argument :id, ID, required: true
  end
end
