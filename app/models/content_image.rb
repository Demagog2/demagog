# frozen_string_literal: true

class ContentImage < ApplicationRecord
  include Discardable

  belongs_to :user, optional: true
  has_one_attached :image

  default_scope { kept }

  def name
    image.filename.to_s
  end

  def self.matching_name(name)
    joins(:image_blob)
      .where("filename ILIKE ?", "%#{name}%")
  end
end
