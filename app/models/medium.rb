# frozen_string_literal: true

class Medium < ApplicationRecord
  default_scope { where(deleted_at: nil) }

  has_many :sources
  belongs_to :attachment, optional: true

  has_one_attached :logo

  def self.matching_name(name)
    where("name LIKE ?", "%#{name}%")
  end

  def self.create_medium(medium_input)
    medium = medium_input.deep_symbolize_keys

    Medium.create! medium
  end

  def self.update_medium(id, medium_input)
    medium = medium_input.deep_symbolize_keys

    Medium.update id, medium
  end

  def self.delete_medium(id)
    medium = Medium.find(id)

    if medium.sources.size > 0
      medium.errors.add(:base, :is_linked_to_some_sources,
        message: "cannot be deleted if it is linked to some sources")
      raise ActiveModel::ValidationError.new(medium)
    end

    medium.deleted_at = Time.now
    medium.save!
  end
end
