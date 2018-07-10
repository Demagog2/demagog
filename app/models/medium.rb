# frozen_string_literal: true

class Medium < ApplicationRecord
  has_many :sources
  has_and_belongs_to_many :media_personalities
  belongs_to :attachment, optional: true

  has_one_attached :logo
end
