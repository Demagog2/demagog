# frozen_string_literal: true

class MenuItem < ApplicationRecord
  KIND_PAGE = "page"
  KIND_DIVIDER = "divider"

  belongs_to :page, optional: true

  scope :ordered, -> { order(order: :asc) }

  def is_page?
    kind == KIND_PAGE
  end

  def is_divider?
    kind == KIND_DIVIDER
  end
end
