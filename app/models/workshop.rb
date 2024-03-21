# frozen_string_literal: true

class Workshop < ApplicationRecord
  has_one_attached :image

  validates :name, :description, :price, presence: true
  validates :price, numericality: { other_than: 0 }
end
