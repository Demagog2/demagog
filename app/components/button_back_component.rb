# frozen_string_literal: true

class ButtonBackComponent < ViewComponent::Base
  def initialize(hidden: false)
    @hidden = hidden
  end
end
