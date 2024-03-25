# frozen_string_literal: true

module Schema::Workshops::Mutations
  class UpdateWorkshopMutation < GraphQL::Schema::RelayClassicMutation
    description "Update workshop information"

    argument :id, ID, required: true
    argument :name, String, required: false
    argument :description, String, required: false
    argument :price, Int, required: false

    payload_type Schema::Workshops::Types::UpdateWorkshopPayload

    def resolve(id:, name: nil, description: nil, price: nil)
      raise Errors::AuthenticationNeededError.new unless context[:current_user]

      changes = { name:, description:, price: }.compact

      result = Workshops::UpdateWorkshopService.new(context[:current_user]).update_workshop(id, changes)

      case result
      in Workshops::UpdateWorkshopService::NotAuthorized
        raise Errors::AuthenticationNeededError.new
      in Workshops::UpdateWorkshopService::NotFound, Workshops::UpdateWorkshopService::UpdatingFailed
        return { message: "Error when updating workshop. Try again or contact administrator." }
      else
        return { workshop: result.workshop }
      end
    end
  end
end
