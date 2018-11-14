# frozen_string_literal: true

class MediaPersonality < ApplicationRecord
  default_scope { where(deleted_at: nil) }

  has_and_belongs_to_many :media
  has_many :sources
  belongs_to :attachment, optional: true

  def self.matching_name(name)
    where("name LIKE ?", "%#{name}%")
  end
end
