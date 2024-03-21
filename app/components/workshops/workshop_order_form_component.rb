# frozen_string_literal: true

class Workshops::WorkshopOrderFormComponent < ViewComponent::Base
  def initialize(workshop_order:)
    @workshop_order = workshop_order
  end
end
