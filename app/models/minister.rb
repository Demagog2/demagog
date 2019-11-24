# frozen_string_literal: true

class Minister < ApplicationRecord
  belongs_to :government
  has_one :speaker
end
