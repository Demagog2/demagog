# frozen_string_literal: true

module Workshops
  class UpdateWorkshopService
    NotAuthorized = Struct.new(:message)
    NotFound = Struct.new(:message)
    UpdatingSuccess = Struct.new(:workshop)
    UpdatingFailed = Struct.new(:message)

    def initialize(current_user)
      @current_user = current_user
    end

    def update_workshop(id, changes)
      workshop = Workshop.find_by(id:)

      return NotFound("Workshop '#{id}' not found ") unless workshop

      if WorkshopAbility.new(@current_user).cannot?(:update, workshop)
        return NotAuthorized.new("User '#{@current_user.full_name}' with id '#{@current_user.id}' is not allowed to update workshops.")
      end

      begin
        workshop.update!(changes) unless changes.empty?

        UpdatingSuccess.new(workshop)
      rescue => e
        UpdatingFailed.new(e.message)
      end
    end
  end
end
