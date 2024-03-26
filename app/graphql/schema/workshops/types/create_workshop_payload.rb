# frozen_string_literal: true

module Schema::Workshops::Types
  class CreateWorkshopPayload < GraphQL::Schema::Union
    possible_types CreateWorkshopSuccess, CreateWorkshopError

    def self.resolve_type(object, _ctx)
      if object.key?(:message)
        CreateWorkshopError
      else
        CreateWorkshopSuccess
      end
    end
  end
end
