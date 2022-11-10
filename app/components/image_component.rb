# frozen_string_literal: true

class ImageComponent < ViewComponent::Base
  def initialize(src:, alt:, lazy:)
    @src = src
    @alt = alt
    @lazy = lazy
  end
end
