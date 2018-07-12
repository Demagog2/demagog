# frozen_string_literal: true

class ContentImage < ApplicationRecord
  has_one_attached :image
end
