# frozen_string_literal: true

class Minister < ApplicationRecord
  belongs_to :government
  belongs_to :speaker
end
