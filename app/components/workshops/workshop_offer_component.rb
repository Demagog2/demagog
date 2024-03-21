# frozen_string_literal: true

class Workshops::WorkshopOfferComponent < ViewComponent::Base
  def initialize(workshop:)
    @workshop = workshop
  end
end
