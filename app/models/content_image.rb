# frozen_string_literal: true

class ContentImage < ApplicationRecord
  belongs_to :user, optional: true
  has_one_attached :image

  default_scope {
    where(deleted_at: nil)
  }

  def name
    image.filename.to_s
  end

  def self.matching_name(name)
    joins(:image_blob)
      .where("filename LIKE ?", "%#{name}%")
  end
end
