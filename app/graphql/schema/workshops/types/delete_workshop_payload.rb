# frozen_string_literal: true

module Schema::Workshops::Types
  class DeleteWorkshopPayload < GraphQL::Schema::Union
    possible_types DeleteWorkshopSuccess, DeleteWorkshopError

    def self.resolve_type(object, _ctx)
      if object.key?(:message)
        DeleteWorkshopError
      else
        DeleteWorkshopSuccess
      end
    end
  end
end
