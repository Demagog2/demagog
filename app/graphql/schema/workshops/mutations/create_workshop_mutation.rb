# frozen_string_literal: true

module Schema::Workshops::Mutations
  class CreateWorkshopMutation < GraphQL::Schema::RelayClassicMutation
    description "Create new workshop"

    argument :name, String, required: true
    argument :description, String, required: true
    argument :price, Int, required: true

    payload_type Schema::Workshops::Types::CreateWorkshopPayload

    def resolve(name:, description:, price:)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      changes = { name:, description:, price: }.compact

      result = Workshops::CreateWorkshopService.new(context[:current_user]).create_workshop(changes)

      case result
      in Workshops::CreateWorkshopService::NotAuthorized
        raise Errors::NotAuthorizedError.new
      in Workshops::CreateWorkshopService::NotFound, Workshops::CreateWorkshopService::CreatingFailed
        { message: "Error when creating workshop. Try again or contact administrator." }
      else
        { workshop: result.workshop }
      end
    end
  end
end
