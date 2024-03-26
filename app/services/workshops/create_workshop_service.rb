# frozen_string_literal: true

module Workshops
  class CreateWorkshopService
    NotAuthorized = Struct.new(:message)
    UpdatingSuccess = Struct.new(:workshop)
    UpdatingFailed = Struct.new(:message)

    def initialize(current_user)
      @current_user = current_user
    end

    def create_workshop(changes)
      if WorkshopAbility.new(@current_user).cannot?(:create, Workshop)
        return NotAuthorized.new("User '#{@current_user.full_name}' with id '#{@current_user.id}' is not allowed to create workshops.")
      end

      begin
        workshop = Workshop.create!(changes)

        UpdatingSuccess.new(workshop)
      rescue => e
        UpdatingFailed.new(e.message)
      end
    end
  end
end
