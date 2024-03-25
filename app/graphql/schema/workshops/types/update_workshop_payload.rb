# frozen_string_literal: true

module Schema::Workshops::Types
  class UpdateWorkshopPayload < GraphQL::Schema::Union
    possible_types UpdateWorkshopSuccess, UpdateWorkshopError

    def self.resolve_type(object, _ctx)
      if object.key?(:message)
        UpdateWorkshopError
      else
        UpdateWorkshopSuccess
      end
    end
  end
end
