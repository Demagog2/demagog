# frozen_string_literal: true

module Workshops
  class DeleteWorkshopService
    NotAuthorized = Struct.new(:message)
    NotFound = Struct.new(:message)
    DeletingSuccess = Struct.new(:id)
    DeletingFailed = Struct.new(:message)

    def initialize(current_user)
      @current_user = current_user
    end

    def delete_workshop(id)
      if WorkshopAbility.new(@current_user).cannot?(:delete, Workshop)
        return NotAuthorized.new("User '#{@current_user.full_name}' with id '#{@current_user.id}' is not allowed to delete workshops.")
      end

      begin
        Workshop.destroy(id)

        DeletingSuccess.new(id)
      rescue => e
        DeletingFailed.new(e.message)
      end
    end
  end
end
