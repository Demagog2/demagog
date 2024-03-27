# frozen_string_literal: true

module Schema::Workshops::Mutations
  class DeleteWorkshopMutation < GraphQL::Schema::RelayClassicMutation
    description "Delete workshop"

    argument :id, ID, required: true

    payload_type Schema::Workshops::Types::DeleteWorkshopPayload

    def resolve(id:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      result = Workshops::DeleteWorkshopService.new(context[:current_user]).delete_workshop(id)

      case result
      in Workshops::DeleteWorkshopService::NotAuthorized
        raise Errors::NotAuthorizedError.new
      in Workshops::DeleteWorkshopService::DeletingFailed
      in Workshops::DeleteWorkshopService::NotFound
        { message: "Error when deleting workshop. Try again or contact administrator." }
      else
        { id: result.id }
      end
    end
  end
end
