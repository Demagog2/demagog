# frozen_string_literal: true

class ButtonNextComponent < ViewComponent::Base
  def initialize(hidden: false)
    @hidden = hidden
  end
end
