# frozen_string_literal: true

class Membership < ApplicationRecord
  scope :current, -> { where(until: nil) }

  belongs_to :body
  belongs_to :speaker
end
